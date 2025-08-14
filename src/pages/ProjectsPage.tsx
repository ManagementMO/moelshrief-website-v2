import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FuturisticButton } from '@/components/ui/futuristic-button';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 'mo-planner',
    title: 'MO-Planner',
    description: 'A financial planning tool that utilizes Excel/VBA formulas to forecast student budgets with 90% accuracy to provide consistent and actionable insights. Incorporates features for dynamic expense categorization.',
    tags: ['Microsoft Excel', 'VBA', 'Python', 'Financial Planning'],
    image: '/images/projects/mo-planner.jpg',
    link: '/projects/mo-planner'
  },
  {
    id: 'focus-forge',
    title: 'FocusForge',
    description: 'A comprehensive Time Management Tool using Excel/VBA, integrating assignment management with deadline conflict resolution, a dynamic calendar, study tracker, journaling, and automated GPA calculator.',
    tags: ['Microsoft Excel', 'VBA', 'Gemini API', 'Time Management'],
    image: '/images/projects/focus-forge.jpg',
    link: '/projects/focus-forge'
  },
  {
    id: 'scam-mule',
    title: 'Scam-Mule',
    description: 'An AI-powered spam detection system using Machine Learning algorithms to analyze call patterns and identify potential scams, achieving 90% accuracy in flagging suspicious calls.',
    tags: ['Python', 'Flask', 'Machine Learning', 'HTML/CSS/JS'],
    image: '/images/projects/scam-mule.jpg',
    link: '/projects/scam-mule'
  },
  {
    id: 'psybridge',
    title: 'Psybridge Technologies',
    description: 'A full-stack web application using Python, Flask, and PostgreSQL to streamline money transfers between various financial institutions, focusing on simplified cross-border transactions.',
    tags: ['Python', 'Flask', 'PostgreSQL', 'MongoDB', 'Docker'],
    image: '/images/projects/psybridge.jpg',
    link: '/projects/psybridge'
  }
];

const ProjectsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      <Navbar />
      
      <main className="pt-20 pb-32">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-primary/10 text-primary mb-4">
              Innovation Portfolio
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="text-secondary">Projects</span>
            </h1>
            
            <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
              Explore my collection of data-driven projects that showcase my expertise in data analysis,
              financial modeling, AI implementation, and full-stack development.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative bg-cyber-card rounded-xl overflow-hidden border border-cyber-border hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg to-transparent opacity-60"></div>
                  
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="relative p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="mb-4 text-muted-foreground">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 text-xs rounded-full bg-cyber-accent/10 text-cyber-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    to={project.link}
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    View Project Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition">
                      <Github className="h-4 w-4 text-white" />
                    </button>
                    <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition">
                      <ExternalLink className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FuturisticButton 
                size="lg"
                onClick={() => window.location.href = "mailto:elshrief.mo@gmail.com"}
              >
                Contact Me for Collaborations
              </FuturisticButton>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectsPage;
