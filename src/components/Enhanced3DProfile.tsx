import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Enhanced3DProfileProps {
  imagePath: string;
  alt?: string;
}

const Enhanced3DProfile: React.FC<Enhanced3DProfileProps> = ({ 
  imagePath, 
  alt = "Profile Image" 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse move for rotation effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate rotation based on mouse position
    if (isDragging) {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;
      
      // Apply rotation with some damping
      setRotation({
        x: currentRotation.x + deltaY * 0.5,
        y: currentRotation.y - deltaX * 0.5
      });
    } else {
      // Subtle hover effect
      const x = ((e.clientX - left) / width - 0.5) * 10;
      const y = ((e.clientY - top) / height - 0.5) * 10;
      
      setRotation({ x: y, y: -x });
    }
  };
  
  // Handle mouse down for press effect and rotation start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPressed(true);
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setCurrentRotation({ ...rotation });
    
    // Add global event listeners
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
  };
  
  // Handle global mouse move (for when dragging outside the element)
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;
      
      setRotation({
        x: currentRotation.x + deltaY * 0.5,
        y: currentRotation.y - deltaX * 0.5
      });
    }
  };
  
  // Handle mouse up to end press and rotation
  const handleMouseUp = () => {
    setIsPressed(false);
    setIsDragging(false);
    
    // Remove global event listeners
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    
    // Spring back to neutral position
    setTimeout(() => {
      setRotation({ x: 0, y: 0 });
    }, 500);
  };
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);
  
  return (
    <div className="w-full h-full relative">
      {/* Holographic frame with animated glow */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-xl"></div>
        
        {/* Animated border glow */}
        <motion.div 
          className="absolute inset-0 rounded-xl"
          style={{ 
            boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          animate={{ 
            boxShadow: [
              'inset 0 0 15px rgba(255, 255, 255, 0.2), 0 0 10px rgba(138, 43, 226, 0.2)',
              'inset 0 0 15px rgba(255, 255, 255, 0.2), 0 0 20px rgba(138, 43, 226, 0.4)',
              'inset 0 0 15px rgba(255, 255, 255, 0.2), 0 0 10px rgba(138, 43, 226, 0.2)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Interactive 3D container */}
      <motion.div
        ref={containerRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing z-10"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => !isDragging && setRotation({ x: 0, y: 0 })}
        style={{
          perspective: '1000px'
        }}
      >
        <motion.div
          className="w-full h-full rounded-xl overflow-hidden"
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
            scale: isPressed ? 0.97 : 1,
            z: isPressed ? -20 : 0
          }}
          transition={{
            type: isDragging ? "tween" : "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <img 
            src={imagePath} 
            alt={alt} 
            className="w-full h-full object-cover rounded-xl"
            style={{
              filter: 'brightness(1.05) contrast(1.05)',
              boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.1)'
            }}
            draggable="false"
          />
          
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Enhanced3DProfile;