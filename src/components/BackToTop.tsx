
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Show button when page is scrolled down and track scroll progress
  useEffect(() => {
    const toggleVisibility = () => {
      // Calculate how far down the page the user has scrolled
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      setScrollProgress(scrolled);
      
      if (winScroll > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener("scroll", toggleVisibility);
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  
  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-4 z-50 p-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/20 shadow-lg"
          style={{
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px rgba(168, 85, 247, 0.2)',
          }}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(168, 85, 247, 0.4)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Circular progress indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.1)" 
                strokeWidth="5"
              />
              <motion.circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="url(#gradient)" 
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * scrollProgress) / 100}
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * scrollProgress) / 100 }}
                transition={{ duration: 0.1 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Arrow icon */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              animate={{ y: [0, -2, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                style={{
                  filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 10l7-7m0 0l7 7m-7-7v18" 
                />
              </svg>
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
