import { Button } from "./ui/button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, lazy, Suspense } from "react";
import type { CSSProperties } from "react";

// Lazy load the enhanced 3D profile component
const Enhanced3DProfile = lazy(() => import("./Enhanced3DProfile"));

// Custom hook for mouse parallax effect
const useMouseParallax = (strength: number = 20, resetOnLeave: boolean = false) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isHovering && resetOnLeave) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * strength;
    const y = ((e.clientY - top) / height - 0.5) * strength;
    
    setPosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    if (resetOnLeave) {
      setPosition({ x: 0, y: 0 });
    }
    setIsHovering(false);
  };

  return {
    position,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }
  };
};

// Animated text component with letter-by-letter animation
const AnimatedText: React.FC<{ text: string; className?: string; delay?: number }> = ({ 
  text, 
  className = "", 
  delay = 0 
}) => {
  return (
    <span className={`inline-block ${className}`} style={{ lineHeight: 1.2 }}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: delay + index * 0.04,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          style={{ 
            display: 'inline-block',
            minHeight: '1.2em'
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

// Neon glow component
const NeonGlow: React.FC<{ color: string; intensity?: number; className?: string }> = ({ 
  color, 
  intensity = 10,
  className = "" 
}) => {
  return (
    <motion.div 
      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${className}`}
      style={{
        background: `radial-gradient(circle at center, ${color}33 0%, transparent 70%)`,
        boxShadow: `0 0 ${intensity}px ${color}55, 0 0 ${intensity * 2}px ${color}33`,
      }}
      animate={{ 
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut",
      }}
    />
  );
};

// Holographic card effect component
const HolographicCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
  strength?: number;
}> = ({ 
  children, 
  className = "", 
  glowColor = "rgba(255, 255, 255, 0.8)",
  strength = 15
}) => {
  const { position, handlers } = useMouseParallax(strength, true);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`relative overflow-hidden group ${className}`}
      {...handlers}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transform: `perspective(1000px) rotateX(${-position.y}deg) rotateY(${position.x}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* Holographic shine effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            transparent 35%,
            ${glowColor} 45%,
            ${glowColor} 55%,
            transparent 65%,
            transparent 100%
          )`,
          backgroundSize: '200% 200%',
          backgroundPosition: isHovered ? '100% 100%' : '0% 0%',
          transition: 'background-position 0.5s ease-out',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Content */}
      {children}
    </motion.div>
  );
};

// Animated particles component
const ParticleField: React.FC<{ count?: number; colors?: string[] }> = ({ 
  count = 30, 
  colors = ['#60A5FA', '#A855F7', '#EC4899'] 
}) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, index) => {
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
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
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [0, -Math.random() * 100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.7, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        );
      })}
    </div>
  );
};

// Main component
const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoverInterest, setHoverInterest] = useState<string | null>(null);
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 0.2, 1], [0.8, 1, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3, 1], [0, 1, 1]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.3, 1], [50, 0, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Typewriter effect
  useEffect(() => {
    const words = ["work", "matter", "inspire", "impact"];
    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const cycleWords = () => {
      setActiveWord(words[currentIndex]);
      currentIndex = (currentIndex + 1) % words.length;
      timeout = setTimeout(cycleWords, 3000);
    };

    // Start after initial delay
    setTimeout(() => {
      setAnimationComplete(true);
      cycleWords();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Mouse movement handler for 3D effect
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - left) / width - 0.5) * 2;  // -1 to 1
    const y = ((event.clientY - top) / height - 0.5) * 2;  // -1 to 1
    setMousePosition({ x, y });
  };

  // Style objects
  const imageStyle = {
    opacity: imageOpacity,
    scale: imageScale,
  } as CSSProperties;

  const transformStyle = {
    transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
    transition: "transform 0.1s ease-out",
  } as CSSProperties;

  const contentStyle = {
    opacity: contentOpacity,
    y: contentY,
  } as CSSProperties;

  // Interest items data
  const interests = [
    { 
      id: "data-science", 
      name: "Data Science", 
      icon: (
        <svg viewBox="0 0 256 255" className="w-8 h-8 text-blue-400">
          <path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="currentColor"/>
          <path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="currentColor"/>
        </svg>
      ),
      color: "#3776AB",
      description: "Transforming raw data into actionable insights through statistical analysis and machine learning."
    },
    { 
      id: "gym", 
      name: "Gym", 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-purple-400">
          <path d="M6 7V17M18 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7H4V17H8M16 7H20V17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 9V15M16 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "#A855F7",
      description: "Building strength, discipline, and mental fortitude through consistent physical training."
    },
    { 
      id: "boba", 
      name: "Boba", 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-amber-400">
          <path d="M7 4h10l1 16H6L7 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2M14 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2" fill="currentColor"/>
          <path d="M8 14c2.5 1.5 5.5 1.5 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: "#F59E0B",
      description: "Exploring the perfect balance of tea, milk, and chewy tapioca pearls for that ultimate refreshment."
    },
    { 
      id: "reading", 
      name: "Reading", 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-green-400">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "#10B981",
      description: "Expanding my knowledge and perspective through books on technology, psychology, and philosophy."
    }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative py-20 lg:py-28 overflow-hidden text-white"
    >
      {/* Dynamic background with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-30">
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
      
      {/* Animated particles */}
      <ParticleField count={40} />
      
      {/* Floating orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left column - Enhanced 3D image with holographic effects */}
            <motion.div 
              className="lg:col-span-5 relative w-full max-w-md mx-auto"
              style={imageStyle}
            >
              <div className="rounded-xl overflow-hidden aspect-[4/5] relative">
                {/* Enhanced 3D profile image with rotation and press effects */}
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-white/30 animate-spin"></div>
                  </div>
                }>
                  <Enhanced3DProfile 
                    imagePath="/images/profile.jpg" 
                    alt="Mohammed Elshrief"
                  />
                </Suspense>
                
                {/* Holographic border with animated glow */}
                <motion.div 
                  className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none" 
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(168,85,247,0.2), inset 0 0 10px rgba(168,85,247,0.1)',
                      '0 0 30px rgba(168,85,247,0.3), inset 0 0 15px rgba(168,85,247,0.2)',
                      '0 0 20px rgba(168,85,247,0.2), inset 0 0 10px rgba(168,85,247,0.1)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Futuristic corner accents */}
                <div className="absolute top-0 left-0 w-12 h-12">
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-blue-400/60 rounded-tl-xl"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="absolute top-0 right-0 w-12 h-12">
                  <motion.div 
                    className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-purple-400/60 rounded-tr-xl"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-12 h-12">
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-purple-400/60 rounded-bl-xl"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12">
                  <motion.div 
                    className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-blue-400/60 rounded-br-xl"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  />
                </div>
              </div>


            </motion.div>
          
            {/* Right column - Enhanced content with animated typography */}
            <motion.div 
              className="lg:col-span-7" 
              style={contentStyle}
            >
              <div className="space-y-6 mb-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight w-full">
                    <div className="flex flex-col items-start justify-center space-y-6 relative">
                      <div className="w-full overflow-visible">
                        <AnimatedText 
                          text="Hi, I'm Mohammed." 
                          className="text-white [text-shadow:_0_0_30px_rgba(255,255,255,0.3)]"
                          delay={0.2}
                        />
                      </div>
                      <div className="w-full overflow-visible">
                        <AnimatedText 
                          text="I try to make things that" 
                          className="text-white [text-shadow:_0_0_30px_rgba(255,255,255,0.3)]"
                          delay={0.6}
                        />
                      </div>
                      <div className="w-full h-[1.5em] overflow-visible relative">
                        <AnimatePresence mode="wait">
                          {activeWord && animationComplete && (
                            <motion.span 
                              key={activeWord}
                              className="absolute text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text [text-shadow:_0_0_30px_rgba(168,85,247,0.5)]"
                              initial={{ y: 40, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -40, opacity: 0 }}
                              transition={{ 
                                duration: 0.5, 
                                ease: [0.215, 0.61, 0.355, 1] 
                              }}
                            >
                              {activeWord}.
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </h2>
                </motion.div>
                
                <motion.p 
                  className="text-xl text-white/80 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  Hey, I'm Mohammed, I'm a data scientist and Management Engineering student at the University of Waterloo (yes, that's a real program). I spend most of my time going to the gym and pretending Python doesn't scare me.
                </motion.p>
              </div>
              
              <motion.h3 
                className="text-2xl font-semibold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                style={{
                  textShadow: '0 0 20px rgba(255,255,255,0.2)',
                }}
              >
                My Interests:
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {interests.map((interest, index) => (
                  <motion.div
                    key={interest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + index * 0.1, duration: 0.8 }}
                    onHoverStart={() => setHoverInterest(interest.id)}
                    onHoverEnd={() => setHoverInterest(null)}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div 
                      className="relative p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 group overflow-hidden"
                      style={{
                        boxShadow: hoverInterest === interest.id 
                          ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${interest.color}33` 
                          : '0 10px 30px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {/* Background glow effect */}
                      <NeonGlow color={interest.color} />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-4">
                          <div 
                            className="w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${interest.color}30, ${interest.color}10)`,
                              borderColor: `${interest.color}30`,
                              boxShadow: hoverInterest === interest.id 
                                ? `0 0 20px ${interest.color}40` 
                                : `0 0 15px ${interest.color}20`,
                            }}
                          >
                            <motion.div
                              animate={hoverInterest === interest.id ? { 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0],
                              } : {}}
                              transition={{ 
                                duration: 2, 
                                repeat: hoverInterest === interest.id ? Infinity : 0,
                                repeatType: "reverse",
                              }}
                            >
                              {interest.icon}
                            </motion.div>
                          </div>
                          <h3 
                            className="text-xl font-semibold transition-colors duration-300"
                            style={{
                              color: hoverInterest === interest.id ? 'white' : 'rgba(255, 255, 255, 0.9)',
                              textShadow: hoverInterest === interest.id 
                                ? `0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px ${interest.color}33` 
                                : 'none',
                            }}
                          >
                            {interest.name}
                          </h3>
                        </div>
                        
                        {/* Description with animated reveal */}
                        <AnimatePresence>
                          {hoverInterest === interest.id && (
                            <motion.p
                              className="text-white/70 text-sm"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {interest.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Animated shine effect */}
                      <motion.div 
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        style={{ 
                          width: '200%',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      
      {/* Animated glow orbs */}
      <motion.div 
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </section>
  );
};

export default AboutSection;
