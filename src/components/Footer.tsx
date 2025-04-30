import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative py-6 overflow-hidden bg-transparent">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      
      {/* Background glow effects */}
      <motion.div 
        className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div 
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500/5 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      ></motion.div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <motion.a 
              href="/" 
              className="text-2xl font-bold group"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
                window.scrollTo(0, 0);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-medium tracking-wide [text-shadow:_0_0_15px_rgb(255_255_255_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(255_255_255_/_90%)]">Mohammed</span>
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text [text-shadow:_0_0_15px_rgb(168,85,247_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(168,85,247_/_90%)]">.</span>
              <span className="text-white font-medium tracking-wide [text-shadow:_0_0_15px_rgb(255_255_255_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(255_255_255_/_90%)]">Elshrief</span>
            </motion.a>
            
            <div className="mt-3 flex justify-center items-center">
              <p className="text-sm text-white/60 flex items-center">
                Built with 
                <span className="inline-block mx-1">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      filter: [
                        'drop-shadow(0 0 2px rgba(255, 0, 100, 0.5))',
                        'drop-shadow(0 0 6px rgba(255, 0, 100, 0.8))',
                        'drop-shadow(0 0 2px rgba(255, 0, 100, 0.5))'
                      ]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ff3366" stroke="#ff3366" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </motion.div>
                </span>
                using 
                <motion.span 
                  className="text-[#3178C6] ml-1 mr-1 hover:text-[#4a8fd6] transition-colors duration-300 cursor-pointer relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  TypeScript
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#3178C6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </motion.span>
                <span className="text-white/60">,</span>
                <motion.span 
                  className="text-[#61DAFB] mx-1 hover:text-[#7de1fc] transition-colors duration-300 cursor-pointer relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  React
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#61DAFB] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </motion.span>
                <span className="text-white/60">,</span>
                <motion.span 
                  className="text-[#38BDF8] ml-1 hover:text-[#5cc9f9] transition-colors duration-300 cursor-pointer relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  & Tailwind
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#38BDF8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </motion.span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
