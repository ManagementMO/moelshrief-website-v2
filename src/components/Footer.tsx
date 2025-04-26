import { motion } from "framer-motion";

const Footer = () => {
  
  return (
    <footer className="relative py-8 overflow-hidden bg-transparent">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      
      {/* Background glow effects */}
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500/5 blur-3xl pointer-events-none"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, index) => (
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
          {/* Logo and copyright in a single row */}
          <div className="text-center">
            <a 
              href="/" 
              className="text-2xl font-bold group"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
                window.scrollTo(0, 0);
              }}
            >
              <span className="text-white font-medium tracking-wide [text-shadow:_0_0_15px_rgb(255_255_255_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(255_255_255_/_90%)]">Mohammed</span>
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text [text-shadow:_0_0_15px_rgb(168,85,247_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(168,85,247_/_90%)]">.</span>
              <span className="text-white font-medium tracking-wide [text-shadow:_0_0_15px_rgb(255_255_255_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(255_255_255_/_90%)]">Elshrief</span>
            </a>
            
            <div className="mt-4 flex justify-center items-center">
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
                <span className="text-blue-400 ml-1 mr-1">TypeScript</span>
                <span className="text-cyan-400 mr-1">React</span>
                <span className="text-sky-400 mr-1">Tailwind</span>
                <span className="text-purple-400">&</span>
                <span className="text-yellow-400 ml-1">Vite</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
