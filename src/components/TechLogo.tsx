import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Code } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';

interface TechLogoProps {
  technology: string;
  className?: string;
}

// Configuration with correct relative paths from the public root
const techConfig: Record<string, { color: string; icon: string; glowColor: string }> = {
  'Microsoft Excel': {
    color: 'from-[#217346]/20 to-[#185A31]/20',
    icon: 'icons/excel.svg',
    glowColor: 'rgba(33, 115, 70, 0.5)'
  },
  'VBA': {
    color: 'from-[#4472C4]/20 to-[#2F5597]/20',
    icon: 'icons/vba.svg',
    glowColor: 'rgba(68, 114, 196, 0.5)'
  },
  'Python': {
    color: 'from-[#3776AB]/20 to-[#FFD43B]/20',
    icon: 'icons/python.svg',
    glowColor: 'rgba(55, 118, 171, 0.5)'
  },
  'Gemini API': {
    color: 'from-[#8E24AA]/20 to-[#673AB7]/20',
    icon: 'icons/gemini.svg',
    glowColor: 'rgba(142, 36, 170, 0.5)'
  },
  'Spark': {
    color: 'from-[#E25A1C]/20 to-[#FF9900]/20',
    icon: 'icons/spark-colored.svg',
    glowColor: 'rgba(226, 90, 28, 0.5)'
  },
  'Flask': {
    color: 'from-[#000000]/20 to-[#333333]/20',
    icon: 'icons/flask.svg',
    glowColor: 'rgba(51, 51, 51, 0.5)'
  },
  'Machine Learning': {
    color: 'from-[#00BCD4]/20 to-[#2196F3]/20',
    icon: 'icons/machine-learning.svg',
    glowColor: 'rgba(0, 188, 212, 0.5)'
  },
  'HTML/CSS/JS': {
    color: 'from-[#E44D26]/20 to-[#F16529]/20',
    icon: 'icons/web.svg',
    glowColor: 'rgba(228, 77, 38, 0.5)'
  },
  'React.js': {
    color: 'from-[#61DAFB]/20 to-[#282C34]/20',
    icon: 'icons/react.svg',
    glowColor: 'rgba(97, 218, 251, 0.5)'
  },
  'PostgreSQL': {
    color: 'from-[#336791]/20 to-[#0F4374]/20',
    icon: 'icons/postgresql.svg',
    glowColor: 'rgba(51, 103, 145, 0.5)'
  },
  'MongoDB': {
    color: 'from-[#47A248]/20 to-[#3F9142]/20',
    icon: 'icons/mongodb.svg',
    glowColor: 'rgba(71, 162, 72, 0.5)'
  },
  'Docker': {
    color: 'from-[#2496ED]/20 to-[#1D76C3]/20',
    icon: 'icons/docker.svg',
    glowColor: 'rgba(36, 150, 237, 0.5)'
  }
};

// Default configuration
const defaultConfig = {
  color: 'from-gray-500/20 to-gray-700/20',
  icon: 'icons/code.svg',
  glowColor: 'rgba(156, 163, 175, 0.5)'
};

export const TechLogo = ({ technology, className }: TechLogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iconSrc, setIconSrc] = useState<string | null>(null);

  const config = techConfig[technology] || defaultConfig;

  useEffect(() => {
    // Set initial icon source
    setIconSrc(config.icon);
    // Reset error state when technology changes
    setImageError(false); 
  }, [config.icon]);

  const handleImageError = () => {
    console.error(`Failed to load icon: ${config.icon} for ${technology}. Falling back.`);
    setImageError(true);
    // Fallback to the generic code icon if the specific one fails
    if (config.icon !== defaultConfig.icon) {
      setIconSrc(defaultConfig.icon); 
    }
  };

  // Determine the final source to use, considering errors
  const finalSrc = imageError && config.icon === defaultConfig.icon ? null : iconSrc;

  // Define styles with type casting for custom properties
  const imgStyle = {
    '--glow-color': config.glowColor, 
  } as CSSProperties;

  const innerGlowStyle = {
    '--glow-color': config.glowColor.replace("0.5", "0.3")
  } as CSSProperties;

  return (
    <motion.div
      className={cn(
        'relative group flex items-center justify-center w-14 h-14 rounded-xl overflow-hidden',
        'border border-white/10 backdrop-blur-xl transition-all duration-300 shadow-lg',
        isHovered ? 'scale-110 shadow-xl' : 'scale-100',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${config.glowColor.replace("0.5", "0.1")} 0%, ${config.glowColor.replace("0.5", "0.05")} 100%)`,
        boxShadow: isHovered 
          ? `0 0 20px ${config.glowColor}, inset 0 0 10px ${config.glowColor.replace("0.5", "0.2")}` 
          : `0 4px 6px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Background gradient overlay */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-70 transition-opacity duration-300',
          config.color,
          isHovered ? 'opacity-100' : 'opacity-70'
        )}
      />
      
      {/* Icon Container */}
      <div 
        className={cn(
          'relative z-10 w-8 h-8 flex items-center justify-center',
          'transition-all duration-300 ease-out',
          isHovered ? 'scale-115 rotate-[-5deg]' : 'scale-100 rotate-0'
        )}
      >
        {finalSrc ? (
          <img
            key={finalSrc} // Add key to force re-render on src change
            src={finalSrc}
            alt={`${technology} logo`}
            className={cn(
              'w-7 h-7 object-contain transition-all duration-300',
              isHovered ? 'brightness-125 filter drop-shadow-glow' : 'brightness-100'
            )}
            style={imgStyle} // Use typed style object
            onError={handleImageError}
            loading="lazy" // Use lazy loading
          />
        ) : (
          // Fallback if even the default icon fails or no src is set
          <Code 
            className={cn(
              'w-6 h-6 transition-all duration-300',
              isHovered ? 'text-white scale-110' : 'text-white/70'
            )}
          />
        )}
      </div>

      {/* Subtle Shine Effect */}
      <div 
        className={cn(
          'absolute top-0 left-[-75%] w-[50%] h-full',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'transform -skew-x-12 transition-transform duration-700 ease-in-out',
          isHovered ? 'translate-x-[250%]' : 'translate-x-0'
        )}
        style={{ pointerEvents: 'none' }} 
      />

      {/* Inner Glow Effect */}
      <div 
        className={cn(
          'absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none',
          isHovered ? 'shadow-[inset_0_0_15px_2px_var(--glow-color)]' : 'shadow-[inset_0_0_5px_1px_rgba(255,255,255,0.1)]'
        )}
        style={innerGlowStyle} // Use typed style object
      />

      {/* Tooltip */}
      <div 
        className={cn(
          'absolute bottom-[-35px] left-1/2 transform -translate-x-1/2 transition-all duration-200 delay-100',
          'pointer-events-none px-2 py-1 text-xs rounded-md backdrop-blur-md whitespace-nowrap shadow-lg',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
        style={{
          background: `linear-gradient(135deg, ${config.glowColor.replace("0.5", "0.8")} 0%, ${config.glowColor.replace("0.5", "0.6")} 100%)`,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {technology}
      </div>
    </motion.div>
  );
}; 