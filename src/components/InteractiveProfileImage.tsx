import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InteractiveProfileImageProps {
  imagePath: string;
  alt?: string;
}

const InteractiveProfileImage: React.FC<InteractiveProfileImageProps> = ({ 
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
    <motion.div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
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
      </motion.div>
    </motion.div>
  );
};

export default InteractiveProfileImage;