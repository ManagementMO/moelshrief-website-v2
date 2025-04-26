import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Code, BrainCircuit, Database, FileText, Palette, Atom } from 'lucide-react';

interface TechIconProps {
  technology: string;
  className?: string;
}

// Using more standard/recognizable SVG icons where available
const icons: Record<string, React.ReactNode> = {
  'Python': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.75,2.5c-5.69,0-5.32,2.46-5.32,2.46l.01,2.55h5.42v.77H4.11s-3.69-.4-3.69,5.38,3.22,5.58,3.22,5.58h1.92V16.4s-.1-3.22,3.17-3.22h5.47s3.07.05,3.07-2.97V5.43s.51-2.93-5.52-2.93m-3.03,1.7a.98.98,0,1,1-.98.98.98.98,0,0,1,.98-.98" fill="#366A96"/>
      <path d="M12.22,21.5c5.69,0,5.32-2.46,5.32-2.46l-.01-2.55H12.11v-.77h7.76s3.69.4,3.69-5.38S20.33,4.75,20.33,4.75H18.4V7.6s.1,3.22-3.17,3.22H9.77s-3.07-.05-3.07,2.97v4.78s-.51,2.93,5.52,2.93m3.03-1.7a.98.98,0,1,1,.98-.98.98.98,0,0,1-.98.98" fill="#FFC331"/>
    </svg>
  ),
  'Microsoft Excel': (
    <svg width="24" height="24" viewBox="0 0 512 476" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#107C41" d="M299 476H67.8C30.4 476 0 445.6 0 408.2V67.8C0 30.4 30.4 0 67.8 0H299l213 238 -213 238z"/>
      <path fill="#185C37" d="M299 0v476l129-142.7c48.5-53.7 48.5-149.9 0-203.6L299 0z"/>
      <path fill="#FFFFFF" d="M230.1 169.7H173v-45.9h57.1c11.8 0 20.3 8.5 20.3 20.3v5.3c0 11.8-8.5 20.3-20.3 20.3zm0 68.1H173v-45.9h57.1c11.8 0 20.3 8.5 20.3 20.3v5.3c0 11.8-8.5 20.3-20.3 20.3zm0 68.2H173v-45.9h57.1c11.8 0 20.3 8.5 20.3 20.3v5.3c0 11.8-8.5 20.3-20.3 20.3zm-85.5 0H87.5v-45.9h57.1c11.8 0 20.3 8.5 20.3 20.3v5.3c0 11.8-8.6 20.3-20.3 20.3zm0-68.2H87.5v-45.9h57.1c11.8 0 20.3 8.5 20.3 20.3v5.3c0 11.8-8.6 20.3-20.3 20.3zm0-68.1H87.5v-45.9h57.1c11.8 0 20.3 8.5 20.3 20.3v5.3c0 11.8-8.6 20.3-20.3 20.3z"/>
      <path fill="#21A366" d="M444.2 476H299l-70.8-103.1 70.8-103.1H444.2c37.4 0 67.8 30.4 67.8 67.8v70.6c0 37.4-30.4 67.8-67.8 67.8z"/>
      <path fill="#33C481" d="M299 476V269.8l47.3 69.1c25.8 37.6 25.8 89 0 126.7L299 476z"/>
      <path fill="#FFFFFF" d="M364.9 359.2l-18.9 36.6h-10.6l18.4-38.1 -18.2-38h10.8l12.7 28.2 12.8-28.2h10.6l-18.1 38.1 18.4 38h-10.6l-17.3-36.7z"/>
    </svg>
  ),
  'VBA': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3A3A38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
  'Gemini API': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#8E24AA"/>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill="#8E24AA"/>
    </svg>
  ),
  'Flask': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5.5C6.33 5.5 3 9.26 3 12.5S6.33 19.5 12 19.5c5.66 0 9-3.76 9-7s-3.34-7-9-7zm0 12c-3.86 0-7-2.69-7-5s3.14-5 7-5 7 2.69 7 5-3.14 5-7 5z" fill="#000000"/>
      <path d="M13.5 9.5H11V17h2.5c1.38 0 2.5-1.12 2.5-2.5v-2.5c0-1.38-1.12-2.5-2.5-2.5z" fill="#000000"/>
    </svg>
  ),
  'Machine Learning': <BrainCircuit size={24} color="#4285F4" />,
  'HTML/CSS/JS': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3L5.5 19L12 21L18.5 19L20 3H4Z" fill="#E44D26"/>
      <path d="M12 5V19.5L17 18L18 5H12Z" fill="#F16529"/>
      <path d="M8.5 11H12V13H8.2L8 11ZM8.7 15H12V17H9.5L9.2 15Z" fill="#EBEBEB"/>
      <path d="M15.5 11H12V13H15.8L16 11ZM15.3 15H12V17H14.5L14.8 15Z" fill="#FFF"/>
      <path d="M18 11H21V8H18V11Z" fill="#F0DB4F"/>
    </svg>
  ),
  'React.js': <Atom size={24} color="#61DAFB" />,
  'PostgreSQL': (
    <svg width="24" height="24" viewBox="0 0 40.83 40.83" fill="#336791" xmlns="http://www.w3.org/2000/svg">
      <path d="M32.76,18.45a10.85,10.85,0,0,0-8.84-10,10.54,10.54,0,0,0-11.23,5.48,11.88,11.88,0,0,0-1.65,4.55A10.71,10.71,0,0,0,12.18,28a9.56,9.56,0,0,0,5.48,3.86,7.5,7.5,0,0,0,3.38.65,8.64,8.64,0,0,0,1.32-.1,7.67,7.67,0,0,0,2.74-.83,8.79,8.79,0,0,0,2.39-1.75,9.46,9.46,0,0,0,3.53-4.61,11.58,11.58,0,0,0,.59-4.37A10.59,10.59,0,0,0,32.76,18.45Zm-2.5,5.36a8.24,8.24,0,0,1-2.94,3.74,6.7,6.7,0,0,1-1.89,1.08,6,6,0,0,1-2.08.41,6.46,6.46,0,0,1-1.83-.27,7.92,7.92,0,0,1-1.92-.78,8.39,8.39,0,0,1-1.83-1.29,7.44,7.44,0,0,1-1.73-2.4,8.35,8.35,0,0,1-.6-3.26,9.24,9.24,0,0,1,.73-3.75,7.94,7.94,0,0,1,1.88-2.85,8.69,8.69,0,0,1,2.8-1.87,8.43,8.43,0,0,1,3.41-.75,8.48,8.48,0,0,1,6.48,2.86,8.72,8.72,0,0,1,2.15,6.28,10.44,10.44,0,0,1-.27,2.86Z"/>
      <path d="M37.39,28.93a8.52,8.52,0,0,0-3.41-5.8,11.88,11.88,0,0,1,.83,4.41,9.46,9.46,0,0,1-1,3.84,10.42,10.42,0,0,1-1.5,2.62,10.78,10.78,0,0,1-1.62,1.9,8.8,8.8,0,0,1-1.25.95,7.54,7.54,0,0,1-.82.46c.66.08,1.32.12,2,.12a7.84,7.84,0,0,0,4.5-1.3,10,10,0,0,0,4.11-4.83,10.93,10.93,0,0,0,.65-4.72,8.79,8.79,0,0,0-2.5-6.57Z"/>
      <path d="M22.15,34.56a9.89,9.89,0,0,1-.16,1.71,11.34,11.34,0,0,1-.48,1.95,11.83,11.83,0,0,1-.76,1.78,11.64,11.64,0,0,1-1,1.58,10.56,10.56,0,0,1-.78.85,10.76,10.76,0,0,1-1.8,1.22A12.78,12.78,0,0,1,15,44.3a11.25,11.25,0,0,1-1.53.1,8.89,8.89,0,0,1-4.91-1.89,8.14,8.14,0,0,1-2.9-5,8.71,8.71,0,0,1,.44-6.3,8,8,0,0,1,2.08-3.75,8.16,8.16,0,0,1,2.86-2.28,8.68,8.68,0,0,1,3.78-1A8.23,8.23,0,0,1,18,25a8.42,8.42,0,0,1,3.12,1.45,7.79,7.79,0,0,1,1.94,2.43,9.29,9.29,0,0,1,1,3.48,10.85,10.85,0,0,1,.16,2.17,8.72,8.72,0,0,0-2.07-.22A7.71,7.71,0,0,0,18,34.93,8.88,8.88,0,0,0,22.15,34.56Z"/>
    </svg>
  ),
  'MongoDB': (
    <svg width="24" height="24" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M132.119 245.312l-6.359-2.172c0 0 .776-32.416-10.856-34.742-7.755-8.996 1.24-381.552 29.158-1.241 0 0-9.615 4.808-11.322 13.029-1.862 8.065-.621 25.127-.621 25.127v0l0 0z" fill="#A6A385"/>
      <path d="M133.22 217.976c0 0 62.153-34.94 43.964-116.755C164.623 45.85 134.997 27.703 131.74 20.723c-3.567-4.963-6.98-13.648-6.98-13.648l2.327 154.015c0 .156-6.246 51.044 6.008 56.783" fill="#499D4A"/>
      <path d="M122.503 215.997c0 0-52.27-35.674-49.167-98.489 2.946-62.817 39.86-93.682 46.994-99.266 4.654-4.963 4.81-6.825 5.12-11.788 3.256 6.98 2.637 104.384 3.101 115.861 1.396 44.204-2.481 85.307-6.048 93.681v0l0 0z" fill="#58AA50"/>
    </svg>
  ),
  'Docker': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#2496ED" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.19 11.12c-.49-.33-1.63-.43-2.48-.28-.11-.78-.56-1.46-1.37-2.08L18.92 8.4l-.31.49c-.39.61-.54 1.46-.5 2.16.03.5.2.93.56 1.46-.26.14-.77.32-1.46.31H3.02c-.39 2.14.27 4.87 1.57 6.77 1.3 1.9 3.25 2.86 5.8 2.86 5.23 0 9.4-2.44 11.98-7.09.77.01 2.43 0 3.28-1.65.04-.06.15-.29.45-.98l.09-.23-.24-.09c-.6-.28-2.02-.32-2.81-.2C20.85 15.9 22.29 13.8 23.19 11.12zM14.91 7.46v-2.93h-3.38v2.93h3.38zm-3.38 1.24v2.92h3.38v-2.92h-3.38zm-3.38 0v2.92h3.38v-2.92H8.15zm-3.38 0v2.92h3.38v-2.92H4.77zm3.38-1.24v2.92h3.38v-2.92H8.15zm3.38 0v2.92h3.38v-2.92h-3.38z"/>
    </svg>
  )
};

// Tech configuration
const techConfig: Record<string, { color: string; glowColor: string }> = {
  'Microsoft Excel': {
    color: 'from-[#107C41]/20 to-[#185A31]/20',
    glowColor: 'rgba(16, 124, 65, 0.5)'
  },
  'VBA': {
    color: 'from-[#000000]/20 to-[#333333]/20',
    glowColor: 'rgba(51, 51, 51, 0.5)'
  },
  'Python': {
    color: 'from-[#3776AB]/20 to-[#FFD43B]/20',
    glowColor: 'rgba(55, 118, 171, 0.5)'
  },
  'Gemini API': {
    color: 'from-[#8E24AA]/20 to-[#673AB7]/20',
    glowColor: 'rgba(142, 36, 170, 0.5)'
  },
  'Flask': {
    color: 'from-[#000000]/20 to-[#333333]/20',
    glowColor: 'rgba(51, 51, 51, 0.5)'
  },
  'Machine Learning': {
    color: 'from-[#00BCD4]/20 to-[#2196F3]/20',
    glowColor: 'rgba(0, 188, 212, 0.5)'
  },
  'HTML/CSS/JS': {
    color: 'from-[#E44D26]/20 to-[#F16529]/20',
    glowColor: 'rgba(228, 77, 38, 0.5)'
  },
  'React.js': {
    color: 'from-[#61DAFB]/20 to-[#282C34]/20',
    glowColor: 'rgba(97, 218, 251, 0.5)'
  },
  'PostgreSQL': {
    color: 'from-[#336791]/20 to-[#0F4374]/20',
    glowColor: 'rgba(51, 103, 145, 0.5)'
  },
  'MongoDB': {
    color: 'from-[#47A248]/20 to-[#3F9142]/20',
    glowColor: 'rgba(71, 162, 72, 0.5)'
  },
  'Docker': {
    color: 'from-[#2496ED]/20 to-[#1D76C3]/20',
    glowColor: 'rgba(36, 150, 237, 0.5)'
  }
};

export const TechIcon = ({ technology, className }: TechIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the icon or use Code as fallback
  const icon = icons[technology] || <Code size={24} color="#888888" />;
  
  const config = techConfig[technology] || {
    color: 'from-gray-500/20 to-gray-700/20',
    glowColor: 'rgba(156, 163, 175, 0.5)'
  };

  return (
    <motion.div
      className={cn(
        'relative group flex items-center justify-center w-14 h-14 rounded-xl overflow-hidden',
        'border border-white/10 backdrop-blur-xl transition-all duration-300 shadow-lg',
        isHovered ? 'scale-110 shadow-xl' : 'scale-100',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${config.glowColor.replace("0.5", "0.1")} 0%, ${config.glowColor.replace("0.5", "0.05")} 100%)`,
        boxShadow: isHovered 
          ? `0 0 20px ${config.glowColor}, inset 0 0 10px ${config.glowColor.replace("0.5", "0.2")}` 
          : `0 4px 6px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Background gradient overlay */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-70 transition-opacity duration-300',
          config.color,
          isHovered ? 'opacity-100' : 'opacity-70'
        )}
      />
      
      {/* Icon Container */}
      <div 
        className={cn(
          'relative z-10 w-8 h-8 flex items-center justify-center',
          'transition-all duration-300 ease-out',
          isHovered ? 'scale-115 rotate-[-5deg]' : 'scale-100 rotate-0'
        )}
      >
        {icon}
      </div>

      {/* Shine Effect */}
      <div 
        className={cn(
          'absolute top-0 left-[-100%] w-[200%] h-[200%]',
          'bg-gradient-to-br from-transparent via-white/20 to-transparent',
          'transform rotate-45 transition-transform duration-700 ease-in-out',
          isHovered ? 'translate-x-[100%]' : 'translate-x-0'
        )}
        style={{ pointerEvents: 'none' }} 
      />

      {/* Inner Glow Effect */}
      <div 
        className={cn(
          'absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none',
          isHovered ? 'shadow-[inset_0_0_15px_2px_var(--glow-color)]' : 'shadow-[inset_0_0_5px_1px_rgba(255,255,255,0.1)]'
        )}
        style={{ 
          '--glow-color': config.glowColor.replace("0.5", "0.3")
        } as React.CSSProperties}
      />

      {/* Tooltip */}
      <div 
        className={cn(
          'absolute bottom-[-35px] left-1/2 transform -translate-x-1/2 transition-all duration-200 delay-100',
          'pointer-events-none px-2 py-1 text-xs rounded-md backdrop-blur-md whitespace-nowrap shadow-lg z-50',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
        style={{
          background: `linear-gradient(135deg, ${config.glowColor.replace("0.5", "0.8")} 0%, ${config.glowColor.replace("0.5", "0.6")} 100%)`,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {technology}
      </div>
    </motion.div>
  );
}; 