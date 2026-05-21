import { motion } from 'framer-motion';
import { TechIcon } from './TechIcon';
import { ExternalLink, Github } from 'lucide-react';
import { useState } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  stats?: string[];
}

export const ProjectCard = ({ 
  title, 
  description, 
  technologies, 
  githubUrl,
  liveUrl,
  image = "/images/projects/placeholder.jpg",
  stats
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-xl h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        transition: 'box-shadow 0.4s ease-out, transform 0.4s ease-out',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Project image with enhanced effects */}
      <div className="relative h-56 overflow-hidden">
        <motion.img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{
            scale: { duration: 0.7, ease: [0.33, 1, 0.68, 1] }
          }}
        />
        
        {/* Enhanced gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
          style={{
            opacity: isHovered ? 0.8 : 0.7,
            transition: 'opacity 0.4s ease-out',
          }}
        ></div>
        
        {/* Project title overlay on image */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-10">
          <motion.h3 
            className="text-2xl font-bold text-white"
            animate={{
              y: isHovered ? -5 : 0,
              textShadow: isHovered 
                ? '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)' 
                : '0 0 10px rgba(255, 255, 255, 0.3)',
            }}
            transition={{ duration: 0.4 }}
          >
            {title}
          </motion.h3>
        </div>
        
        {/* Enhanced links with glow effect */}
        <div className="absolute top-4 right-4 z-10 flex gap-3">
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center"
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
              }}
              transition={{ duration: 0.2 }}
            >
              <Github className="w-5 h-5 text-white" />
            </motion.a>
          )}
          {liveUrl && (
            <motion.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center"
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
              }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </motion.a>
          )}
        </div>
      </div>
      
      {/* Content with enhanced styling */}
      <div className="p-6 pt-4 relative z-10">
        <p className="text-white/80 mb-5 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Enhanced stats with gradient backgrounds */}
        {stats && stats.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {stats.map((stat, index) => (
              <motion.span
                key={index}
                className="text-sm px-3 py-1 rounded-full text-white font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                }}
                whileHover={{
                  y: -2,
                  boxShadow: '0 5px 15px rgba(168, 85, 247, 0.2)',
                }}
              >
                {stat}
              </motion.span>
            ))}
          </div>
        )}

        {/* Technologies with enhanced animations */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/10">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <TechIcon 
                technology={tech}
                className="filter drop-shadow-lg"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced RTX Effects */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Top edge glow */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
          }}
        />
        
        {/* Bottom edge glow */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: 'rgba(168, 85, 247, 0.5)' }} />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: 'rgba(168, 85, 247, 0.5)' }} />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }} />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }} />
      </motion.div>
    </motion.div>
  );
}; 