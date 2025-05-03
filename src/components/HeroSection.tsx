import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Button } from "./ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Lazy load the data visualization component
const DataVisualization = lazy(() => import("./DataVisualization"));
const AudioVisualizer = lazy(() => import("./AudioVisualizer"));

// Cybernetic particle effect
const CyberneticParticle: React.FC<{ index: number }> = ({ index }) => {
  const size = Math.random() * 6 + 2;
  const duration = Math.random() * 15 + 15;
  const delay = Math.random() * 5;
  
  // Generate a random color with a bias towards blue/purple hues
  const hue = Math.random() * 60 + 220; // 220-280 range (blue to purple)
  const saturation = Math.random() * 30 + 70; // 70-100%
  const lightness = Math.random() * 20 + 60; // 60-80%
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  
  return (
    <motion.div
      key={index}
      className="absolute rounded-full"
      style={{
        width: size + 'px',
        height: size + 'px',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        filter: 'blur(0.5px)',
      }}
      initial={{ opacity: 0 }}
      animate={{
        y: [0, -Math.random() * 200 - 50],
        x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.5],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
};

// Animated text with letter-by-letter reveal
const AnimatedText: React.FC<{ 
  text: string; 
  className?: string; 
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}> = ({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.03,
  once = true
}) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: delay + index * staggerDelay,
            ease: [0.215, 0.61, 0.355, 1]
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

// Holographic effect component
const HolographicEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className = "", strength = 15 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div 
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x * strength}deg) rotateX(${-mousePosition.y * strength}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Holographic shine effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 255, 255, 0.3) 45%,
            rgba(255, 255, 255, 0.3) 55%,
            transparent 65%,
            transparent 100%
          )`,
          backgroundSize: '200% 200%',
          backgroundPosition: isHovered ? '100% 100%' : '0% 0%',
          transition: 'background-position 0.5s ease-out',
          mixBlendMode: 'overlay',
        }}
      />
      
      {children}
    </motion.div>
  );
};

// Futuristic data visualization component
const DataVisualization: React.FC = () => {
  return (
    <div className="relative w-full h-[500px]">
      {/* Core orb */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-xl"
        style={{
          boxShadow: '0 0 80px rgba(168, 85, 247, 0.4), inset 0 0 30px rgba(168, 85, 247, 0.3)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          filter: ['blur(5px)', 'blur(8px)', 'blur(5px)'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Orbiting rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-purple-500/30"
        style={{
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-blue-500/20"
        style={{
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
        }}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Data nodes */}
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-blue-400"
            style={{
              marginLeft: -6,
              marginTop: -6,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.4)',
              transform: `translate(${x}px, ${y}px)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        );
      })}
      
      {/* Connection lines */}
      <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-70">
        <motion.g
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            transformOrigin: 'center',
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => {
            const angle1 = (index / 6) * Math.PI * 2;
            const angle2 = ((index + 2) / 6) * Math.PI * 2;
            const radius = 120;
            
            const x1 = Math.cos(angle1) * radius + 128;
            const y1 = Math.sin(angle1) * radius + 128;
            const x2 = Math.cos(angle2) * radius + 128;
            const y2 = Math.sin(angle2) * radius + 128;
            
            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                strokeDasharray="5,5"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />
            );
          })}
        </motion.g>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Pulsing core */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
        style={{
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Data streams */}
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const length = Math.random() * 30 + 50;
        
        return (
          <motion.div
            key={`stream-${index}`}
            className="absolute top-1/2 left-1/2 bg-gradient-to-t from-transparent via-blue-400 to-transparent"
            style={{
              width: '2px',
              height: `${length}px`,
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${angle}rad)`,
            }}
            animate={{
              height: [length, length + 20, length],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          />
        );
      })}
    </div>
  );
};

// Glowing button component
const GlowButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline';
}> = ({ 
  children, 
  onClick, 
  className = "", 
  variant = 'primary' 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        className={cn(
          "relative overflow-hidden group rounded-full px-8 py-6 text-sm font-medium tracking-wide transition-all duration-300",
          variant === 'primary' 
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30" 
            : "border border-white/20 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 text-white hover:border-white/40 backdrop-blur-sm",
          className
        )}
        onClick={onClick}
      >
        {/* Animated glow effect */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }}
          animate={{ 
            scale: [0.8, 1.2],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        
        {/* Button content */}
        <span className="relative z-10">{children}</span>
        
        {/* Shine effect on hover */}
        <motion.div 
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ 
            width: '200%',
          }}
        />
      </Button>
    </motion.div>
  );
};

// Main component
const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const [loaded, setLoaded] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Animate on load
  useEffect(() => {
    setLoaded(true);
    
    // Start word cycling after initial animation
    const timer = setTimeout(() => {
      setTypingComplete(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Word cycling effect
  useEffect(() => {
    if (!typingComplete) return;
    
    const words = ["Insights", "Solutions", "Discoveries", "Innovations"];
    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const cycleWords = () => {
      setActiveWord(words[currentIndex]);
      currentIndex = (currentIndex + 1) % words.length;
      timeout = setTimeout(cycleWords, 3000);
    };

    cycleWords();
    return () => clearTimeout(timeout);
  }, [typingComplete]);

  // Subtle mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Get mouse position relative to container (normalized values between -1 and 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      setMousePosition({ x, y });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-16 transition-colors duration-300"
    >
      {/* Dynamic background with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/95 to-black"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-purple-900/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-purple-900/10 to-pink-900/10"></div>
        </div>
        
        {/* Grid overlay for depth */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>
      
      {/* Cybernetic particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, index) => (
          <CyberneticParticle key={index} index={index} />
        ))}
      </div>
      
      {/* Floating orbs with enhanced glass effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 80%)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(59, 130, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0],
            filter: ['blur(5px)', 'blur(10px)', 'blur(5px)'],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 80%)',
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.3), inset 0 0 30px rgba(168, 85, 247, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
            rotate: [0, -5, 0],
            filter: ['blur(5px)', 'blur(8px)', 'blur(5px)'],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div 
          className="absolute top-2/3 right-1/4 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 80%)',
            boxShadow: '0 0 40px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(236, 72, 153, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.06, 1],
            rotate: [0, 8, 0],
            filter: ['blur(5px)', 'blur(7px)', 'blur(5px)'],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Text content */}
        <motion.div 
          className="w-full lg:w-3/5"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div className="relative">
            <motion.div 
              className="text-xs font-mono tracking-wider text-white/70 uppercase mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center">
                <motion.div 
                  className="w-8 sm:w-10 h-[1px] bg-gradient-to-r from-blue-400 to-purple-500 mr-3"
                  animate={{
                    width: [0, 40],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                  }}
                />
                <AnimatedText 
                  text="Data Artisan" 
                  delay={0.4}
                  staggerDelay={0.05}
                />
              </div>
            </motion.div>
            
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.4 }}
                  className="pb-2 text-white"
                  style={{
                    textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)',
                  }}
                >
                  <AnimatedText 
                    text="Mohammed Elshrief" 
                    delay={0.6}
                    staggerDelay={0.02}
                  />
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text pb-2"
                  style={{
                    textShadow: '0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.2)',
                  }}
                >
                  <AnimatedText 
                    text="Transforming Data" 
                    delay={0.8}
                    staggerDelay={0.02}
                  />
                </motion.div>
              </div>
              <div className="overflow-hidden h-[1.2em] relative">
                <AnimatePresence mode="wait">
                  {!typingComplete && (
                    <motion.div
                      key="initial"
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      exit={{ y: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: [0.25, 0.1, 0, 1], delay: 0.6 }}
                      className="pb-2 text-white absolute"
                      style={{
                        textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)',
                      }}
                    >
                      <AnimatedText 
                        text="Into Insights" 
                        delay={1.0}
                        staggerDelay={0.02}
                      />
                    </motion.div>
                  )}
                  
                  {activeWord && typingComplete && (
                    <motion.div
                      key={activeWord}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
                      className="pb-2 text-white absolute"
                      style={{
                        textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1)',
                      }}
                    >
                      Into {activeWord}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/80 max-w-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{
                textShadow: '0 0 20px rgba(0,0,0,0.5)',
              }}
            >
              Crafting elegant data solutions that transform business challenges into 
              opportunities through strategic analysis and technical expertise.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-start gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <GlowButton 
                variant="primary"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Projects
              </GlowButton>
              
              <GlowButton 
                variant="outline"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get In Touch
              </GlowButton>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Enhanced data visualization */}
        <motion.div 
          className="hidden lg:block lg:w-2/5 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <HolographicEffect strength={5} className="group">
            <DataVisualization />
          </HolographicEffect>
        </motion.div>
      </div>
      
      {/* Enhanced scrolling indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div 
          className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent"
          animate={{ 
            scaleY: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="mt-2 text-xs font-light text-white/50 tracking-widest"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          SCROLL
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
