import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FuturisticButton } from "./ui/futuristic-button";
import { ExternalLink, Github } from "lucide-react";
import { TechIcon } from "./TechIcon";
import { cn } from "@/lib/utils";

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleProjects, setVisibleProjects] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Project data
  const projects = [
    {
      id: 1,
      title: "MO-Planner",
      description: "Built a comprehensive financial planning application using Excel/VBA with automated calculations, data validation, and user-friendly interfaces. Features include expense tracking, budget forecasting, and dynamic financial reporting with 90% accuracy in predictions.",
      image: "/images/projects/vba-finance-tool.jpg",
      category: "finance",
      technologies: ["Microsoft Excel", "VBA", "Python"],
      githubUrl: "https://github.com/ManagementMO/VBA-Financial-Planning-Tool",
      liveUrl: "https://github.com/ManagementMO/VBA-Financial-Planning-Tool",
      stats: ["90% accuracy", "100+ students"],
      featured: true
    },
    {
      id: 2,
      title: "FocusForge",
      description: "Developed a full-stack productivity suite in Excel/VBA with modern UI/UX principles. Features include dynamic calendar integration, task management system, automated calculations, and AI-powered insights using Gemini API.",
      image: "/images/projects/focusforge.jpg",
      category: "productivity",
      technologies: ["Microsoft Excel", "VBA", "Gemini API"],
      githubUrl: "https://github.com/ManagementMO/focus-forge",
      liveUrl: "https://jasooh.github.io/mse-100-launch-page/",
      stats: ["Dynamic Calendar", "AI Integration"]
    },
    {
      id: 3,
      title: "Scam-Mah",
      description: "Built a real-time spam detection web application using Flask backend and machine learning algorithms. Features include pattern analysis, API integration, and a responsive frontend interface, achieving 90% accuracy in scam detection.",
      image: "/images/projects/scam-mah.jpg",
      category: "ai",
      technologies: ["Python", "Flask", "Machine Learning", "HTML/CSS/JS", "Gemini API"],
      githubUrl: "https://github.com/nicholasching/Scam-Mah",
      liveUrl: "https://devpost.com/software/scam-mah",
      stats: ["90% accuracy", "3rd Place @ NewHacks 2024"]
    },
    {
      id: 4,
      title: "Paybridge Technologies",
      description: "Developed a full-stack web application using Python, React.js, and PostgreSQL to streamline money transfers between various financial institutions, focusing on simplifying cross-border transactions.",
      image: "/images/projects/pay-bridge.jpg",
      category: "web",
      technologies: ["Python", "React.js", "PostgreSQL", "MongoDB", "Docker"],
      githubUrl: "https://github.com/ManagementMO/paybridge",
      liveUrl: "https://paybridgetech.com/",
      stats: ["50+ beta users", "$1,000+ transactions"]
    }
  ];
  
  // Filter projects based on active category
  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);
  
  // Get visible projects
  const projectsToShow = filteredProjects.slice(0, visibleProjects);
  
  // Categories for filter
  const categories = [
    { id: "all", name: "All Projects" },
    { id: "finance", name: "Finance" },
    { id: "productivity", name: "Productivity" },
    { id: "ai", name: "AI & ML" },
    { id: "web", name: "Web Development" },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const projectVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      id="projects" 
      className="relative py-10 overflow-hidden bg-gradient-to-b from-background to-futuristic-dark/40"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.h2 
            className="text-4xl font-bold mb-6 text-white"
            style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
        </div>
        
        {/* Project filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full transition-all duration-300",
                "hover:scale-105 hover-glow optimize-gpu",
                activeCategory === category.id
                  ? "bg-futuristic-purple text-white shadow-glow-sm"
                  : "bg-white/5 hover:bg-white/10"
              )}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeCategory}
          >
            {isLoading ? (
              // Loading skeletons
              [...Array(4)].map((_, index) => (
                <div 
                  key={`skeleton-${index}`}
                  className="h-[400px] rounded-xl overflow-hidden skeleton"
                />
              ))
            ) : (
              projectsToShow.map(project => (
                <motion.div 
                  key={project.id}
                  variants={projectVariants}
                  className={cn(
                    "group relative rounded-xl overflow-hidden bg-white/5 hover:bg-white/10",
                    "border border-white/10 transition-all duration-500",
                    "project-card optimize-gpu",
                    project.featured && "featured"
                  )}
                >
                  {/* Project image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Project links */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label={`View live demo of ${project.title}`}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-6 relative">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Stats */}
                    {project.stats && project.stats.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.stats.map((stat, index) => (
                          <span
                            key={index}
                            className="text-sm px-3 py-1 rounded-full bg-white/10 text-white"
                          >
                            {stat}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      {project.technologies.map((tech, index) => (
                        <TechIcon 
                          key={index}
                          technology={tech}
                          className="transform group-hover:scale-110 transition-transform duration-300"
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* RTX Effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-50" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/15 to-transparent z-10 blur-xl" />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Buttons Container */}
        <div className="flex flex-col items-center gap-4 mt-12">
          {/* Load More Button */}
          {!isLoading && visibleProjects < filteredProjects.length && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FuturisticButton
                onClick={() => setVisibleProjects(prev => prev + 4)}
                variant="outline"
                className="px-8"
              >
                Load More Projects
              </FuturisticButton>
            </motion.div>
          )}
          
          {/* View All Projects Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FuturisticButton 
              variant="outline" 
              size="lg"
              onClick={() => window.open('https://github.com/ManagementMO', '_blank')}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/70 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
            >
              View All Projects
            </FuturisticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
