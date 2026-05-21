import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CyberneticCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Mouse position with spring physics
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Add spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trailing dots positions
  const [trailingDots, setTrailingDots] = useState<{x: number, y: number, opacity: number}[]>([]);
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Add position to trailing dots
      setTrailingDots(prev => {
        const newDots = [...prev, { x: e.clientX, y: e.clientY, opacity: 1 }];
        // Keep only the last 8 positions
        return newDots.slice(-8);
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Check if hovering over clickable elements
    const handlePointerCheck = () => {
      const hoveredElement = document.elementFromPoint(cursorX.get(), cursorY.get());
      const isClickable = hoveredElement?.tagName === 'BUTTON' || 
                          hoveredElement?.tagName === 'A' || 
                          hoveredElement?.closest('button') || 
                          hoveredElement?.closest('a') ||
                          window.getComputedStyle(hoveredElement || document.body).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    // Fade out trailing dots over time
    const fadeTrailingDots = () => {
      setTrailingDots(prev => 
        prev.map(dot => ({
          ...dot,
          opacity: dot.opacity > 0 ? dot.opacity - 0.1 : 0
        })).filter(dot => dot.opacity > 0)
      );
    };

    // Set up event listeners
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handlePointerCheck);
    
    // Set up interval for fading dots
    const fadeInterval = setInterval(fadeTrailingDots, 50);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handlePointerCheck);
      clearInterval(fadeInterval);
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) {
    return null;
  }

  return (
    <>
      {/* Trailing dots */}
      {trailingDots.map((dot, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-1 h-1 rounded-full bg-blue-400 pointer-events-none z-[9999]"
          style={{
            x: dot.x,
            y: dot.y,
            opacity: dot.opacity,
            scale: 1 - (i * 0.1),
          }}
        />
      ))}
      
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400"
          animate={{
            width: isPointer ? '40px' : '24px',
            height: isPointer ? '40px' : '24px',
            opacity: [0.6, 0.8, 0.6],
            borderWidth: isClicking ? '2px' : '1px',
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 200,
            opacity: {
              repeat: Infinity,
              duration: 2,
            }
          }}
        />
        
        {/* Inner dot */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400"
          animate={{
            width: isClicking ? '8px' : '4px',
            height: isClicking ? '8px' : '4px',
            opacity: isPointer ? 1 : 0.8,
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 200,
          }}
        />
        
        {/* Crosshair lines (only visible when hovering over clickable elements) */}
        {isPointer && (
          <>
            <motion.div
              className="absolute h-px bg-blue-400/70 -translate-y-1/2"
              style={{
                width: '12px',
                left: '-18px',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.7, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute h-px bg-blue-400/70 -translate-y-1/2"
              style={{
                width: '12px',
                right: '-18px',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.7, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute w-px bg-blue-400/70 -translate-x-1/2"
              style={{
                height: '12px',
                top: '-18px',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.7, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute w-px bg-blue-400/70 -translate-x-1/2"
              style={{
                height: '12px',
                bottom: '-18px',
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.7, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.2 }}
            />
          </>
        )}
      </motion.div>
    </>
  );
};

export default CyberneticCursor;