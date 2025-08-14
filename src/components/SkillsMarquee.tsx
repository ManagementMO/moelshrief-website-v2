import React, { useMemo, useState, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, useScroll, useTransform, AnimatePresence, useAnimation, useDragControls, PanInfo } from "framer-motion";

interface Skill {
  name: string;
  icon: string;
  color: string;
}

// FIRST ROW SKILLS (frontend/web development focus)
const firstRowSkills: Skill[] = [
  { name: "React", icon: "react", color: "#61DAFB" },
  { name: "TypeScript", icon: "typescript", color: "#3178C6" },
  { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
  { name: "Next.js", icon: "nextjs", color: "#000000" },
  { name: "Svelte", icon: "svelte", color: "#FF3E00" },
  { name: "HTML5", icon: "html5", color: "#E34F26" },
  { name: "CSS3", icon: "css3", color: "#1572B6" },
  { name: "Sass", icon: "sass", color: "#CC6699" },
  { name: "Vue.js", icon: "vuejs", color: "#4FC08D" },
  { name: "Figma", icon: "figma", color: "#F24E1E" },
  { name: "Git", icon: "git", color: "#F05032" },
];

// SECOND ROW SKILLS (backend/infrastructure focus)
const secondRowSkills: Skill[] = [
  { name: "Node.js", icon: "nodejs", color: "#339933" },
  { name: "Python", icon: "python", color: "#3776AB" },
  { name: "Express.js", icon: "express", color: "#FFFFFF" },
  { name: "FastAPI", icon: "fastapi", color: "#009688" },
  { name: "Django", icon: "django", color: "#0C4B33" },
  { name: "Go", icon: "go", color: "#00ADD8" },
  { name: "MongoDB", icon: "mongodb", color: "#47A248" },
  { name: "PostgreSQL", icon: "postgresql", color: "#336791" },
  { name: "AWS", icon: "amazonaws", color: "#FF9900" },
  { name: "Docker", icon: "docker", color: "#2496ED" },
  { name: "Redis", icon: "redis", color: "#DC382D" },
  { name: "GraphQL", icon: "graphql", color: "#E10098" },
  { name: "VS Code", icon: "visualstudiocode", color: "#007ACC" },
];

// Add this at the top of your file, after the imports
const SHINE_CSS = `
  @keyframes singleShine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .shine-effect-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: 0;
    border-radius: 0.75rem;
  }
  
  .shine-effect {
    position: absolute;
    top: -100%;
    left: -100%;
    right: -100%;
    bottom: -100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 255, 255, 0.15), 
      transparent
    );
    transform: translateX(-100%);
  }
  
  /* Only animate on group-hover (once) */
  .group:hover .shine-effect-container {
    opacity: 1;
  }
  
  .group:hover .shine-effect {
    animation: singleShine 0.8s ease-in-out;
    animation-iteration-count: 1;
  }
`;

// Enhanced component for a single skill item with glass effect
const GlassSkillItem: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const theme = useTheme();
  const getIconUrl = (icon: string) => {
    // Robust mapping for colored logos
    switch (icon) {
      // Frontend Technologies
      case 'react':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
      case 'typescript':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg';
      case 'javascript':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg';
      case 'nextjs':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg';
      case 'tailwindcss':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg';
      case 'html5':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg';
      case 'css3':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg';
      case 'sass':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg';
      case 'vuejs':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg';
      case 'svelte':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg';
      case 'figma':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg';
      
      // Backend Technologies
      case 'nodejs':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg';
      case 'python':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
      case 'express':
        return 'https://cdn.simpleicons.org/express/FFFFFF';
      case 'fastapi':
        return 'https://cdn.simpleicons.org/fastapi/009688';
      case 'django':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain-wordmark.svg';
      case 'go':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg';
      case 'mongodb':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg';
      case 'postgresql':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg';
      case 'graphql':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg';
      case 'firebase':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg';
      
      // Infrastructure & Tools
      case 'amazonaws':
        return '/icons/aws-colored.svg';
      case 'docker':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-plain-wordmark.svg';
      case 'redis':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg';
      case 'git':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg';
      case 'visualstudiocode':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg';
      default:
        return `https://cdn.simpleicons.org/${icon}`;
    }
  };
  const iconUrl = getIconUrl(skill.icon);
  const [isHovered, setIsHovered] = useState(false);
  const shineControls = useAnimation();
  const shineVariants = {
    hidden: { x: "-110%" },
    visible: {
      x: "110%",
      transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] }
    }
  };
  
  const hoverDelayMs = (index % 5) * 50;
  
  const lighterColor = useMemo(() => {
    const hex = skill.color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.min(255, r + 40);
    g = Math.min(255, g + 40);
    b = Math.min(255, b + 40);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, [skill.color]);

  const isDark = theme.mode === 'dark';

  return (
    <motion.div 
      className="flex flex-col items-center gap-3 min-w-[130px] group" 
      style={{ perspective: "1500px" }}
      onHoverStart={() => {
        setIsHovered(true);
        shineControls.start("visible");
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        shineControls.start("hidden", { duration: 0 });
      }}
    >
      <motion.div 
        className="relative h-24 w-24 rounded-xl flex items-center justify-center p-5 overflow-hidden"
        style={{
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isHovered ? `rgba(${skill.color.replace('#', '').match(/.{2}/g)?.map(c => parseInt(c, 16)).join(',')}, 0.3)` : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered 
            ? `0 15px 35px rgba(0, 0, 0, 0.4), 0 5px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${skill.color}55, inset 0 0 0 1px rgba(255, 255, 255, 0.15)`
            : `0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.08)`,
          transition: `all 0.6s cubic-bezier(0.19, 1, 0.22, 1) ${hoverDelayMs}ms`,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ scale: { duration: 0.5, ease: [0.19, 1, 0.22, 1] } }}
      >
        {/* Subtle border highlight */}
        <motion.div 
          className="absolute inset-0 rounded-xl"
          style={{
            border: `1px solid ${isHovered ? `${skill.color}40` : 'rgba(255, 255, 255, 0.1)'}`,
            transition: 'border 0.3s ease',
          }}
        />
        {/* Framer Motion shine effect, controlled */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
        >
          <motion.div
            className="absolute left-[-60%] top-[-60%] w-[220%] h-[220%] bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-xl"
            variants={shineVariants}
            initial="hidden"
            animate={shineControls}
          />
        </motion.div>
        {/* Icon with enhanced effects */}
        <motion.div 
          className="w-14 h-14 relative z-10"
          style={{ 
            filter: isHovered 
              ? `drop-shadow(0 0 10px rgba(255,255,255,0.7)) drop-shadow(0 0 5px rgba(255,255,255,0.5))`
              : `drop-shadow(0 5px 10px rgba(0,0,0,${isDark ? '0.5' : '0.3'}))`
          }}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <motion.img
              src={iconUrl}
              alt={`${skill.name} logo`}
              className="w-12 h-12 object-contain"
              style={{
                filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                transition: 'filter 0.5s ease',
              }}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/icons/fallback-colored.svg';
              }}
            />
          </div>
        </motion.div>
      </motion.div>
      
      {/* Enhanced skill name with futuristic animation */}
      <motion.span 
        className="text-sm font-medium text-white"
        style={{
          textShadow: isHovered 
            ? `0 0 15px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.7), 0 0 5px rgba(255, 255, 255, 0.5)` 
            : '0 0 10px rgba(255, 255, 255, 0.3)',
          transition: 'all 0.5s ease',
          color: isHovered ? '#ffffff' : 'white',
          fontWeight: isHovered ? '600' : '500',
          letterSpacing: isHovered ? '0.5px' : 'normal',
        }}
      >
        {skill.name}
        
        {/* Add a subtle underline animation on hover */}
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-[1px] bottom-[-2px]"
            style={{
              background: `linear-gradient(to right, transparent, ${skill.color}, transparent)`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.span>
    </motion.div>
  );
};

export default function SkillsMarquee() {
  const theme = useTheme();
  const [firstRowX, setFirstRowX] = useState(0);
  const [secondRowX, setSecondRowX] = useState(-(130 * secondRowSkills.length));
  const [firstRowIsDragging, setFirstRowIsDragging] = useState(false);
  const [secondRowIsDragging, setSecondRowIsDragging] = useState(false);
  
  const firstRowDuration = `${firstRowSkills.length * 10}s`;
  const secondRowDuration = `${secondRowSkills.length * 10}s`;
  
  // Animation controls for auto-scrolling
  const firstRowControls = useAnimation();
  const secondRowControls = useAnimation();
  
  // Auto-scroll animation when not dragging
  React.useEffect(() => {
    if (!firstRowIsDragging) {
      const itemWidth = 130;
      const totalWidth = itemWidth * firstRowSkills.length;
      firstRowControls.start({
        x: [0, -totalWidth],
        transition: {
          duration: parseFloat(firstRowDuration),
          repeat: Infinity,
          ease: "linear"
        }
      });
    } else {
      firstRowControls.stop();
    }
  }, [firstRowIsDragging, firstRowControls, firstRowDuration]);
  
  React.useEffect(() => {
    if (!secondRowIsDragging) {
      const itemWidth = 130;
      const totalWidth = itemWidth * secondRowSkills.length;
      secondRowControls.start({
        x: [-totalWidth, 0],
        transition: {
          duration: parseFloat(secondRowDuration),
          repeat: Infinity,
          ease: "linear"
        }
      });
    } else {
      secondRowControls.stop();
    }
  }, [secondRowIsDragging, secondRowControls, secondRowDuration]);

  const handleDrag = (
    info: PanInfo, 
    currentX: number, 
    setX: React.Dispatch<React.SetStateAction<number>>,
    skillsLength: number
  ) => {
    const newX = currentX + info.delta.x;
    setX(newX);
  };

  const handleDragEnd = (
    info: PanInfo,
    currentX: number,
    setX: React.Dispatch<React.SetStateAction<number>>,
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
    skillsLength: number
  ) => {
    // Add smooth momentum based on velocity
    const velocity = info.velocity.x;
    const momentum = velocity * 0.1; // Momentum for smooth feel
    const finalX = currentX + momentum;
    
    // Set the final position where the user released + momentum
    setX(finalX);
    
    // Stop dragging state - this will trigger the useEffect to restart animation from new position
    setIsDragging(false);
  };
  

  return (
    <section className="py-20 overflow-hidden relative reveal" id="skills">
      <style>{SHINE_CSS}</style>

      {/* Transparent background to blend with the page background */}
      <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
      
      {/* Subtle grid overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Cybernetic particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, index) => {
          // Generate a random color with a bias towards blue/purple hues
          const hue = Math.random() * 60 + 220; // 220-280 range (blue to purple)
          const saturation = Math.random() * 30 + 70; // 70-100%
          const lightness = Math.random() * 20 + 60; // 60-80%
          const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          const size = Math.random() * 4 + 2;
          
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
                y: [0, -Math.random() * 100 - 50],
                x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Futuristic title with animated glow */}
          <div className="relative inline-block mb-6">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight relative z-10 text-white"
              style={{
                textShadow: '0 0 30px rgba(255, 255, 255, 0.8)',
              }}
            >
              Tech Stack
            </motion.h2>
            
            {/* Animated glow effect behind the text */}
            <motion.div
              className="absolute -inset-10 z-0 opacity-50 blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </div>
          
          {/* Enhanced description with animated text reveal */}
          <div className="overflow-hidden">
            <motion.p 
              className="text-lg text-white/80 max-w-3xl mx-auto"
              style={{
                textShadow: '0 0 10px rgba(0,0,0,0.5)',
              }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Description removed as requested */}
            </motion.p>
          </div>
        </motion.div>
        
        {/* Enhanced container with cosmic shadow effect */}
        <div className="relative mb-4 overflow-hidden group -mx-24">
          {/* Cosmic gradient background that blends with space */}
          <div className="absolute inset-0" style={{ background: '#000' }}></div>
          
          {/* Nebula-like glow effects */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-purple-500/5 blur-3xl"></div>
          
          {/* Subtle cosmic dust particles */}
          <div className="absolute inset-0 opacity-20 mix-blend-screen" 
               style={{
                 backgroundImage: 'radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 2px)',
                 backgroundSize: '50px 50px',
               }}>
          </div>
          
          {/* True fade gradient overlays for smooth logo fade-in/out */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-64 z-20" 
               style={{
                 background: 'linear-gradient(to right, #0a0a0a 0%, transparent 100%)'
               }} />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-64 z-20" 
               style={{
                 background: 'linear-gradient(to left, #0a0a0a 0%, transparent 100%)'
               }} />
          
          <motion.div 
            className={`flex py-6 w-min relative z-10 cursor-grab`}
            animate={firstRowControls}
            style={{ 
              x: firstRowX,
            }}
            drag="x"
            dragConstraints={false}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => setFirstRowIsDragging(true)}
            onDrag={(event, info) => handleDrag(info, firstRowX, setFirstRowX, firstRowSkills.length)}
            onDragEnd={(event, info) => handleDragEnd(info, firstRowX, setFirstRowX, setFirstRowIsDragging, firstRowSkills.length)}
            whileDrag={{ cursor: 'grabbing' }}
            id="skills-row-1"
          >
            {[...firstRowSkills, ...firstRowSkills, ...firstRowSkills].map((skill, i) => (
              <GlassSkillItem key={`ltr-${i}`} skill={skill} index={i} />
            ))}
          </motion.div>

        </div>
        
        {/* Row 2: Analytics & ML Tools - Right to Left */}
        <div className="relative overflow-hidden group -mx-24">
          {/* Cosmic gradient background that blends with space */}
          <div className="absolute inset-0" style={{ background: '#000' }}></div>
          
          {/* Nebula-like glow effects */}
          <div className="absolute top-1/3 right-1/4 w-36 h-36 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-44 h-44 rounded-full bg-blue-500/5 blur-3xl"></div>
          
          {/* Subtle cosmic dust particles */}
          <div className="absolute inset-0 opacity-20 mix-blend-screen" 
               style={{
                 backgroundImage: 'radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 2px)',
                 backgroundSize: '50px 50px',
               }}>
          </div>
          
          {/* True fade gradient overlays for smooth logo fade-in/out */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-64 z-20" 
               style={{
                 background: 'linear-gradient(to right, #0a0a0a 0%, transparent 100%)'
               }} />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-64 z-20" 
               style={{
                 background: 'linear-gradient(to left, #0a0a0a 0%, transparent 100%)'
               }} />
          
          <motion.div 
            className={`flex py-6 w-min relative z-10 cursor-grab`}
            animate={secondRowControls}
            style={{ 
              x: secondRowX,
            }}
            drag="x"
            dragConstraints={false}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => setSecondRowIsDragging(true)}
            onDrag={(event, info) => handleDrag(info, secondRowX, setSecondRowX, secondRowSkills.length)}
            onDragEnd={(event, info) => handleDragEnd(info, secondRowX, setSecondRowX, setSecondRowIsDragging, secondRowSkills.length)}
            whileDrag={{ cursor: 'grabbing' }}
            id="skills-row-2"
          >
            {[...secondRowSkills, ...secondRowSkills, ...secondRowSkills].map((skill, i) => (
              <GlassSkillItem key={`rtl-${i}`} skill={skill} index={i} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
