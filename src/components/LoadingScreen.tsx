import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const lofiText = [
  'Getting things ready...',
  'Almost there...',
  'Welcome.'
];

const stepDuration = 1200; // ms

const LoadingScreen = () => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step < lofiText.length - 1) {
      const t = setTimeout(() => setStep(step + 1), stepDuration);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 3 + 1, 100);
        return newProgress;
      });
    }, 200);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'hidden';
    return () => { body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 25%, #313244 50%, #2a2a3e 75%, #1e1e2e 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ 
        scale: 0.98,
        opacity: 0,
        filter: "blur(8px)",
        transition: { 
          duration: 1.5,
          ease: "easeInOut"
        }
      }}
    >
      {/* Dreamy Floating Orbs */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(203, 166, 247, 0.1) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
        animate={{ 
          x: [0, 30, -20, 0],
          y: [0, -25, 15, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        className="absolute bottom-32 right-16 w-24 h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(250, 179, 135, 0.15) 0%, transparent 70%)',
          filter: 'blur(15px)'
        }}
        animate={{ 
          x: [0, -25, 20, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.8, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div 
        className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(166, 227, 161, 0.12) 0%, transparent 70%)',
          filter: 'blur(12px)'
        }}
        animate={{ 
          x: [0, 15, -30, 0],
          y: [0, -20, 25, 0],
          scale: [1, 1.3, 0.7, 1]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Subtle Animated Background Overlay */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(203, 166, 247, 0.02), transparent)',
        }}
        animate={{ 
          background: [
            'linear-gradient(45deg, transparent, rgba(203, 166, 247, 0.02), transparent)',
            'linear-gradient(225deg, transparent, rgba(250, 179, 135, 0.015), transparent)',
            'linear-gradient(45deg, transparent, rgba(203, 166, 247, 0.02), transparent)'
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Progressive Coffee Cups */}
      {[
        { x: 10, y: 15, delay: 0.5, color: '#fab387' },
        { x: 85, y: 20, delay: 1.0, color: '#cba6f7' },
        { x: 15, y: 70, delay: 1.5, color: '#a6e3a1' },
        { x: 80, y: 75, delay: 2.0, color: '#f9e2af' },
        { x: 50, y: 10, delay: 2.5, color: '#f5c2e7' },
        { x: 30, y: 45, delay: 3.0, color: '#94e2d5' },
        { x: 70, y: 50, delay: 3.5, color: '#fab387' },
        { x: 20, y: 85, delay: 4.0, color: '#cba6f7' },
        { x: 60, y: 25, delay: 4.5, color: '#a6e3a1' },
        { x: 35, y: 80, delay: 5.0, color: '#f9e2af' },
        { x: 90, y: 45, delay: 5.5, color: '#f5c2e7' },
        { x: 5, y: 50, delay: 6.0, color: '#94e2d5' },
        { x: 45, y: 70, delay: 6.5, color: '#fab387' },
        { x: 75, y: 15, delay: 7.0, color: '#cba6f7' },
        { x: 25, y: 25, delay: 7.5, color: '#a6e3a1' },
        { x: 65, y: 80, delay: 8.0, color: '#f9e2af' },
        { x: 40, y: 15, delay: 8.5, color: '#f5c2e7' },
        { x: 85, y: 60, delay: 9.0, color: '#94e2d5' },
        { x: 15, y: 40, delay: 9.5, color: '#fab387' },
        { x: 55, y: 85, delay: 10.0, color: '#cba6f7' }
      ].map((cup, index) => (
        <motion.div
          key={`coffee-${index}`}
          className="absolute"
          style={{
            left: `${cup.x}%`,
            top: `${cup.y}%`,
          }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: cup.delay, 
            duration: 2, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 12
          }}
        >
          <div className="relative">
            <motion.div 
              className="w-8 h-10 rounded-b-lg border-2"
              style={{ 
                borderColor: cup.color,
                background: `linear-gradient(to bottom, ${cup.color}15, ${cup.color}08)`
              }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: cup.delay + 2,
                ease: "easeInOut"
              }}
            />
            <div 
              className="absolute -right-2 top-2 w-3 h-4 border-2 border-t-0 rounded-r-full"
              style={{ borderColor: cup.color }}
            />
            {/* Steam */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-3 rounded-full"
                style={{
                  left: `${2 + i * 2}px`,
                  top: '-8px',
                  background: `${cup.color}50`
                }}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 0.1, 0.4]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: cup.delay + i * 0.4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Gentle Waves */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 20% 30%, rgba(203, 166, 247, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 600px 300px at 80% 70%, rgba(250, 179, 135, 0.02) 0%, transparent 50%)
          `
        }}
        animate={{
          background: [
            `radial-gradient(ellipse 800px 400px at 20% 30%, rgba(203, 166, 247, 0.03) 0%, transparent 50%),
             radial-gradient(ellipse 600px 300px at 80% 70%, rgba(250, 179, 135, 0.02) 0%, transparent 50%)`,
            `radial-gradient(ellipse 800px 400px at 25% 35%, rgba(203, 166, 247, 0.02) 0%, transparent 50%),
             radial-gradient(ellipse 600px 300px at 75% 65%, rgba(250, 179, 135, 0.03) 0%, transparent 50%)`,
            `radial-gradient(ellipse 800px 400px at 20% 30%, rgba(203, 166, 247, 0.03) 0%, transparent 50%),
             radial-gradient(ellipse 600px 300px at 80% 70%, rgba(250, 179, 135, 0.02) 0%, transparent 50%)`
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />


      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-8">
        
        {/* Beautiful Central Filling Coffee Cup */}
        <motion.div
          className="relative w-40 h-48 mb-8"
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 2, ease: "easeOut", type: "spring", stiffness: 80 }}
        >
          {/* Soft Glow Behind Cup */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(203, 166, 247, 0.08) 0%, transparent 70%)',
              filter: 'blur(20px)'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Coffee Cup Container */}
          <div className="relative w-28 h-36 mx-auto">
            {/* Cup Body with Beautiful Gradient */}
            <motion.div 
              className="absolute inset-0 border-4 rounded-b-3xl border-t-0 overflow-hidden backdrop-blur-sm"
              style={{ 
                borderColor: '#cba6f7',
                background: `
                  linear-gradient(135deg, 
                    rgba(203, 166, 247, 0.08) 0%, 
                    rgba(250, 179, 135, 0.06) 50%, 
                    rgba(166, 227, 161, 0.04) 100%
                  )
                `,
                boxShadow: '0 8px 32px rgba(203, 166, 247, 0.1)'
              }}
              animate={{
                boxShadow: [
                  '0 8px 32px rgba(203, 166, 247, 0.1)',
                  '0 12px 40px rgba(250, 179, 135, 0.15)',
                  '0 8px 32px rgba(203, 166, 247, 0.1)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Beautiful Coffee Filling */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 rounded-b-3xl overflow-hidden"
                style={{ 
                  background: `
                    linear-gradient(to top, 
                      #fab387 0%, 
                      #f9e2af 30%, 
                      #f5c2e7 60%, 
                      rgba(203, 166, 247, 0.8) 100%
                    )
                  `,
                  opacity: 0.9
                }}
                initial={{ height: '0%' }}
                animate={{ height: '95%' }}
                transition={{ 
                  duration: 4.2, 
                  ease: "easeOut",
                  delay: 0.8
                }}
              />
              
              {/* Coffee Surface with Shimmer */}
              <motion.div
                className="absolute left-1 right-1 h-2 rounded-full overflow-hidden"
                style={{ 
                  background: `
                    linear-gradient(90deg, 
                      rgba(203, 166, 247, 0.6) 0%, 
                      rgba(250, 179, 135, 0.8) 50%, 
                      rgba(203, 166, 247, 0.6) 100%
                    )
                  `,
                  top: '8px',
                  backdropFilter: 'blur(4px)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: [0, 0.8, 0.8],
                  y: [20, 0, 0]
                }}
                transition={{ 
                  duration: 4.2,
                  ease: "easeOut",
                  delay: 0.8
                }}
              >
                {/* Surface Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 2,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Foam/Bubbles on Surface */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`bubble-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${4 + Math.random() * 4}px`,
                    height: `${4 + Math.random() * 4}px`,
                    left: `${20 + Math.random() * 60}%`,
                    top: '6px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(2px)'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 0.6, 0.6],
                    scale: [0, 1, 1]
                  }}
                  transition={{ 
                    duration: 1,
                    delay: 2 + i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
            
            {/* Beautiful Cup Handle */}
            <motion.div 
              className="absolute -right-5 top-6 w-7 h-14 border-4 border-t-0 border-l-0 rounded-r-full backdrop-blur-sm"
              style={{ 
                borderColor: '#94e2d5',
                background: 'linear-gradient(45deg, rgba(148, 226, 213, 0.1), rgba(203, 166, 247, 0.05))',
                boxShadow: '0 4px 16px rgba(148, 226, 213, 0.2)'
              }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Dreamy Steam Animation */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`steam-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${1 + Math.random()}px`,
                  left: `${8 + i * 4}px`,
                  top: '-16px',
                  background: `rgba(${i % 2 === 0 ? '203, 166, 247' : '250, 179, 135'}, 0.4)`,
                  filter: 'blur(1px)'
                }}
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  y: [0, -20, -40],
                  opacity: [0, 0.7, 0],
                  height: [0, 8, 12],
                  scale: [1, 1.2, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1.8 + i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Cozy Heart Detail */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg"
              style={{ color: '#f5c2e7' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ 
                delay: 2.5, 
                duration: 1, 
                ease: "easeOut",
                type: "spring",
                stiffness: 200
              }}
            >
              ♡
            </motion.div>
          </div>
        </motion.div>

        {/* Status Text */}
        <motion.div
          key={step}
          className="text-lg font-light text-center min-h-[2em] flex items-center justify-center"
          style={{ color: '#a6adc8' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <span className="relative">
            {lofiText[step]}
            <motion.span
              className="inline-block w-1 h-4 ml-1 rounded-full"
              style={{ background: '#fab387' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default LoadingScreen;
