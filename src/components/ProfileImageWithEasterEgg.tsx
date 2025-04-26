import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileImageProps {
  imagePath: string;
  alt?: string;
}

const ProfileImageWithEasterEgg: React.FC<ProfileImageProps> = ({ 
  imagePath, 
  alt = "Profile Image" 
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  // Handle click and easter egg
  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);
  };
  
  // Show easter egg when click count reaches 5
  useEffect(() => {
    if (clickCount >= 5) {
      setShowEasterEgg(true);
      
      // Hide easter egg after 3 seconds
      const timer = setTimeout(() => {
        setShowEasterEgg(false);
        setClickCount(0);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [clickCount]);
  
  return (
    <div className="relative w-full h-full">
      {/* Easter egg message */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white font-medium whitespace-nowrap [text-shadow:_0_0_10px_rgba(255,255,255,0.8)]">
              STOP 😭
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/70 rotate-45 border-r border-b border-white/20"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Profile image */}
      <img 
        src={imagePath} 
        alt={alt} 
        className="w-full h-full object-cover rounded-xl cursor-pointer"
        style={{
          filter: 'brightness(1.05) contrast(1.05)',
          boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.1)'
        }}
        onClick={handleClick}
        draggable="false"
      />
    </div>
  );
};

export default ProfileImageWithEasterEgg;