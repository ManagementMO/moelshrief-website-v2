import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  audioUrl?: string;
  color?: string;
  height?: number;
  barCount?: number;
  className?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  color = '#60A5FA',
  height = 40,
  barCount = 64,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(Array(barCount).fill(0));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // Initialize audio on component mount
  useEffect(() => {
    if (!audioUrl) return;
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.loop = true;
    
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl]);
  
  // Set up audio analyzer
  const setupAudio = () => {
    if (!audioRef.current) return;
    
    // Create audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    
    // Create analyzer
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    // Connect audio to analyzer
    sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
    
    // Start visualization
    visualize();
  };
  
  // Visualize audio data
  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateData = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Process data for visualization
      const processedData = Array.from({ length: barCount }, (_, i) => {
        const index = Math.floor(i * (bufferLength / barCount));
        return dataArray[index] / 255; // Normalize to 0-1
      });
      
      setAudioData(processedData);
      rafIdRef.current = requestAnimationFrame(updateData);
    };
    
    updateData();
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    } else {
      // Initialize audio context on first play (to handle autoplay restrictions)
      if (!audioContextRef.current) {
        setupAudio();
      }
      
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Generate random data for preview when no audio is playing
  useEffect(() => {
    if (!isPlaying && isLoaded) {
      const interval = setInterval(() => {
        const randomData = Array.from({ length: barCount }, () => Math.random() * 0.3);
        setAudioData(randomData);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, isLoaded, barCount]);
  
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end justify-center h-full w-full gap-[2px]">
        {audioData.map((value, index) => (
          <motion.div
            key={index}
            className="w-1 rounded-t-sm"
            style={{
              backgroundColor: color,
              height: `${Math.max(2, value * height)}px`,
              opacity: 0.7 + value * 0.3,
            }}
            initial={{ height: 2 }}
            animate={{ height: `${Math.max(2, value * height)}px` }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>
      
      {audioUrl && (
        <button
          onClick={togglePlay}
          className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-xs text-white/70 hover:text-white/90 transition-colors"
          disabled={!isLoaded}
        >
          {!isLoaded ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
        </button>
      )}
    </div>
  );
};

export default AudioVisualizer;