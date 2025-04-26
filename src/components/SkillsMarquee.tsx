import React, { useMemo, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  icon: string;
  color: string;
}

// FIRST ROW SKILLS (data engineering/infrastructure focus)
const firstRowSkills: Skill[] = [
  { name: "Python", icon: "python", color: "#3776AB" },
  { name: "SQL", icon: "mysql", color: "#4479A1" },
  { name: "Pandas", icon: "pandas", color: "#150458" },
  { name: "Spark", icon: "apachespark", color: "#E25A1C" },
  { name: "Kafka", icon: "apachekafka", color: "#231F20" },
  { name: "AWS", icon: "amazonaws", color: "#FF9900" },
  { name: "Docker", icon: "docker", color: "#2496ED" },
  { name: "Kubernetes", icon: "kubernetes", color: "#326CE5" },
  { name: "Airflow", icon: "apacheairflow", color: "#017A9B" },
  { name: "Hadoop", icon: "apachehadoop", color: "#D22128" },
  { name: "Redis", icon: "redis", color: "#DC382D" },
  { name: "PostgreSQL", icon: "postgresql", color: "#336791" },
];

// SECOND ROW SKILLS (analytics/visualization/ML focus)
const secondRowSkills: Skill[] = [
  { name: "TensorFlow", icon: "tensorflow", color: "#FF6F00" },
  { name: "PyTorch", icon: "pytorch", color: "#EE4C2C" },
  { name: "NumPy", icon: "numpy", color: "#013243" },
  { name: "Power BI", icon: "powerbi", color: "#F2C811" },
  { name: "Tableau", icon: "tableau", color: "#E97627" },
  { name: "Excel", icon: "microsoftexcel", color: "#217346" },
  { name: "R", icon: "r", color: "#276DC3" },
  { name: "SciKit Learn", icon: "scikitlearn", color: "#F7931E" },
  { name: "Azure", icon: "microsoftazure", color: "#0078D4" },
  { name: "Analytics", icon: "googleanalytics", color: "#E37400" },
  { name: "Git", icon: "git", color: "#F05032" },
  { name: "VS Code", icon: "visualstudiocode", color: "#007ACC" },
];

// Enhanced component for a single skill item with glass effect
const GlassSkillItem: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  const theme = useTheme();
  const iconUrl = `https://cdn.simpleicons.org/${skill.icon}`;
  const [isHovered, setIsHovered] = useState(false);
  
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="relative h-24 w-24 rounded-xl flex items-center justify-center p-5 overflow-hidden holographic-card cybernetic-glow"
        style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isHovered ? `rgba(${skill.color.replace('#', '').match(/.{2}/g)?.map(c => parseInt(c, 16)).join(',')}, 0.3)` : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered 
            ? `0 15px 35px rgba(0, 0, 0, 0.4), 0 5px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${skill.color}55, inset 0 0 0 1px rgba(255, 255, 255, 0.15)`
            : `0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.08)`,
          transition: `all 0.6s cubic-bezier(0.19, 1, 0.22, 1) ${hoverDelayMs}ms`,
        }}
        whileHover={{ 
          scale: 1.05,
        }}
        transition={{
          scale: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
        }}
      >
        {/* Enhanced color accent ring with animation */}
        <motion.div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(circle at center, ${skill.color}33 0%, transparent 70%)`,
            border: `1px solid ${skill.color}22`,
            opacity: isHovered ? 0.6 : 0.2,
            transition: 'opacity 0.5s ease',
          }}
          animate={isHovered ? {
            boxShadow: [
              `0 0 10px ${skill.color}22`,
              `0 0 20px ${skill.color}33`,
              `0 0 10px ${skill.color}22`
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Enhanced glossy highlight with animation */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl"
          style={{
            opacity: isHovered ? 0.8 : 0.6,
            transition: 'opacity 0.5s ease',
          }}
          animate={isHovered ? {
            opacity: [0.6, 0.8, 0.6],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Enhanced bottom reflection */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-white/10 to-transparent rounded-b-xl"
          style={{
            opacity: isHovered ? 0.5 : 0.2,
            transition: 'opacity 0.5s ease',
          }}
        />
        
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
                target.src = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${skill.icon}.svg`;
                target.style.filter = `brightness(0) invert(1)`;
                target.onerror = () => {
                  target.src = '';
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const textEl = document.createElement('div');
                    textEl.innerText = skill.name.substring(0, 2).toUpperCase();
                    textEl.style.fontSize = '20px';
                    textEl.style.fontWeight = 'bold';
                    textEl.style.color = skill.color;
                    textEl.style.filter = `drop-shadow(0 0 5px ${skill.color}44)`;
                    parent.appendChild(textEl);
                  }
                };
              }}
            />
          </div>
        </motion.div>

        {/* Enhanced hover glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(circle at center, ${skill.color}22 0%, transparent 70%)`,
            filter: 'blur(20px)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
          animate={isHovered ? {
            opacity: [0.7, 1, 0.7],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Animated particles on hover */}
        {isHovered && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  boxShadow: `0 0 ${Math.random() * 5 + 5}px ${skill.color}44`,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.random() * 10 - 5, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random(),
                }}
              />
            ))}
          </>
        )}
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
  const firstRowDuration = `${firstRowSkills.length * 10}s`;
  const secondRowDuration = `${secondRowSkills.length * 10}s`;
  
  const keyframes = `
    @keyframes marquee-rtl {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-130px * ${secondRowSkills.length})); }
    }
    @keyframes marquee-ltr {
      0% { transform: translateX(calc(-130px * ${firstRowSkills.length})); }
      100% { transform: translateX(0); }
    }
    .animate-marquee-rtl {
      animation: marquee-rtl linear infinite;
    }
    .animate-marquee-ltr {
      animation: marquee-ltr linear infinite;
    }
    .group:hover .pause-on-hover {
      animation-play-state: paused;
    }
  `;

  return (
    <section className="py-20 overflow-hidden relative reveal" id="skills">
      <style>{keyframes}</style>

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
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Futuristic title with animated glow */}
          <div className="relative inline-block mb-6">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight relative z-10"
              style={{
                background: 'linear-gradient(to right, #60a5fa, #a855f7, #ec4899)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(168,85,247,0.5)',
              }}
              animate={{
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
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
              A blend of programming, visualization, and modelling tools that help me turn raw data into 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text ml-1 font-medium">
                real-world impact.
              </span>
            </motion.p>
          </div>
        </motion.div>
        
        {/* Enhanced container with cosmic shadow effect */}
        <div className="relative mb-6 overflow-hidden group">
          {/* Cosmic gradient background that blends with space */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 backdrop-blur-sm rounded-3xl"></div>
          
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
          
          {/* Enhanced fade edges that blend with the space background */}
          <div className="absolute top-0 bottom-0 left-0 w-80 z-10 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none rounded-l-3xl"></div>
          <div className="absolute top-0 bottom-0 right-0 w-80 z-10 bg-gradient-to-l from-black via-black/70 to-transparent pointer-events-none rounded-r-3xl"></div>
          
          <div className="flex py-6 w-min animate-marquee-ltr pause-on-hover relative z-10 overflow-x-auto scrollbar-hide" 
               style={{ animationDuration: firstRowDuration, scrollBehavior: 'smooth' }}
               id="skills-row-1">
            {[...firstRowSkills, ...firstRowSkills].map((skill, i) => (
              <GlassSkillItem key={`ltr-${i}`} skill={skill} index={i} />
            ))}
          </div>

        </div>
        
        {/* Row 2: Analytics & ML Tools - Right to Left */}
        <div className="relative overflow-hidden group">
          {/* Cosmic gradient background that blends with space */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 backdrop-blur-sm rounded-3xl"></div>
          
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
          
          {/* Enhanced fade edges that blend with the space background */}
          <div className="absolute top-0 bottom-0 left-0 w-80 z-10 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none rounded-l-3xl"></div>
          <div className="absolute top-0 bottom-0 right-0 w-80 z-10 bg-gradient-to-l from-black via-black/70 to-transparent pointer-events-none rounded-r-3xl"></div>
          
          <div className="flex py-6 w-min animate-marquee-rtl pause-on-hover relative z-10 overflow-x-auto scrollbar-hide" 
               style={{ animationDuration: secondRowDuration, scrollBehavior: 'smooth' }}
               id="skills-row-2">
            {[...secondRowSkills, ...secondRowSkills].map((skill, i) => (
              <GlassSkillItem key={`rtl-${i}`} skill={skill} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
