import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FuturisticButton } from '@/components/ui/futuristic-button';
import { ChevronLeft, ExternalLink, Github, Award, BarChart, Code, BookOpen } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TechIcon } from '@/components/TechIcon';

// Project database based on your resume
const projectsData = {
  'mo-planner': {
    title: 'MO-Planner',
    subtitle: 'Financial Planning Tool',
    description: 'A comprehensive financial planning tool that utilizes Excel/VBA formulas to forecast student budgets with 90% accuracy to provide consistent and actionable insights, incorporating features for dynamic expense categorization.',
    longDescription: `MO-Planner was created to address the financial challenges faced by students. As a student trustee and data analyst, I recognized the need for a tool that could provide accurate financial forecasting while being accessible to users without advanced financial knowledge.

The tool leverages VBA programming to automate complex calculations and provide a user-friendly interface. It integrates data visualization components to help users understand their spending patterns and make informed decisions about their finances.

Key features include expense categorization, budget forecasting, and financial literacy tips integrated throughout the application. The tool has helped over 100 students through university clubs and online platforms.`,
    tags: ['Microsoft Excel', 'VBA', 'Python', 'Financial Planning', 'Data Visualization'],
    image: '/images/projects/mo-planner.jpg',
    gallery: [
      '/images/projects/mo-planner-detail-1.jpg',
      '/images/projects/mo-planner-detail-2.jpg',
      '/images/projects/mo-planner-detail-3.jpg',
    ],
    technologies: ['Microsoft Excel', 'VBA', 'Python'],
    achievements: [
      '90% accuracy in budget forecasting',
      'Shared with over 100 students',
      'Promoted financial literacy',
      'Enhanced student financial planning',
    ],
    github: 'https://github.com/ManagementMO/mo-planner',
    liveDemo: 'https://mo-planner.netlify.app',
  },
  'focus-forge': {
    title: 'FocusForge',
    subtitle: 'Time Management System',
    description: 'A comprehensive Time Management Tool using Excel/VBA, integrating assignment management with deadline conflict resolution, a dynamic calendar, study tracker, journaling, and automated GPA calculator.',
    longDescription: `FocusForge is an advanced time management system designed specifically for students juggling multiple assignments, deadlines, and personal commitments. Built with Excel/VBA and enhanced with the Gemini API, it offers a complete solution for academic organization.

The system features a dynamic calendar that visualizes deadlines and potential conflicts, helping students plan ahead and avoid last-minute rushes. The study tracker component gamifies the learning process by recording study sessions and providing insights on productivity patterns.

What makes FocusForge unique is its integrated approach to student life - combining academic planning with personal journaling and GPA tracking. The automated GPA calculator analyzes current grades and provides recommendations for improvement by analyzing user patterns.`,
    tags: ['Microsoft Excel', 'VBA', 'Gemini API', 'Time Management', 'Productivity'],
    image: '/images/projects/focus-forge.jpg',
    gallery: [
      '/images/projects/focus-forge-detail-1.jpg',
      '/images/projects/focus-forge-detail-2.jpg',
      '/images/projects/focus-forge-detail-3.jpg',
    ],
    technologies: ['Microsoft Excel', 'VBA', 'Gemini API'],
    achievements: [
      'Dynamic calendar system with conflict resolution',
      'Personalized insights through AI recommendations',
      'Integrated GPA calculator with grade forecasting',
      'Study tracking with productivity analytics',
    ],
    github: 'https://github.com/ManagementMO/focus-forge',
    liveDemo: 'https://focus-forge.netlify.app',
  },
  'scam-mah': {
    title: 'Scam-Mah',
    subtitle: 'AI-powered Spam Detection',
    description: 'Engineered an AI-powered spam detection system using StandardScaler and IsolationForest ML algorithms to analyze call patterns and identify potential scams, achieving 90% accuracy in flagging suspicious calls during testing.',
    longDescription: `Scam-Mah was developed during the NewHacks 2023 hackathon to address the growing problem of phone scams targeting vulnerable populations. Our team recognized that existing solutions were often reactive rather than preventative, and we set out to create a system that could identify potential scams before they cause harm.

The solution uses machine learning algorithms including StandardScaler and IsolationForest to analyze call patterns and identify anomalies that might indicate suspicious activity. By focusing on behavioral patterns rather than simple blacklists, our system can adapt to new types of scams as they emerge.

The project won 3rd place at NewHacks 2023, recognized for its innovative approach to a widespread problem and its potential for real-world application. The combination of Python backend with a Flask web interface makes it accessible to users with varying technical backgrounds.`,
    tags: ['Python', 'Machine Learning', 'Flask', 'Data Analysis', 'Gemini API'],
    image: '/images/projects/scam-mah.gif',
    gallery: [
      '/images/projects/scam-mah-detail-1.jpg',
      '/images/projects/scam-mah-detail-2.jpg',
      '/images/projects/scam-mah-detail-3.jpg',
    ],
    technologies: ['Python', 'Flask', 'Machine Learning', 'HTML/CSS/JS', 'Gemini API'],
    achievements: [
      '90% accuracy in flagging suspicious calls',
      '3rd Place at NewHacks 2023',
      'Innovative use of ML for pattern recognition',
      'User-friendly interface for non-technical users'
    ],
    github: 'https://github.com/ManagementMO/scam-mah',
    liveDemo: 'https://devpost.com/software/scam-mah',
  },
  'paybridge': {
    title: 'Paybridge',
    subtitle: 'Financial Transfer Platform',
    description: 'Developed a full-stack web application using Python, React.js, and PostgreSQL to streamline money transfers between various financial institutions, focusing on simplifying cross-border transactions.',
    longDescription: `Paybridge is a financial technology platform designed to simplify cross-border money transfers. Built with a modern tech stack including Python, React.js, and PostgreSQL, it addresses the complexities and high fees often associated with international financial transactions.

The platform features a React.js frontend that provides a smooth, intuitive user experience for initiating and tracking transfers. The Python backend handles the complex business logic and security requirements essential for financial applications. Data is securely stored in a PostgreSQL database, while MongoDB is used for caching and performance optimization.

The entire application is containerized using Docker, ensuring consistent deployment across different environments and making scaling straightforward. During the beta testing phase, the platform processed over $1,000 in transactions across 50+ users, validating both the technical implementation and the market need.`,
    tags: ['Python', 'React.js', 'PostgreSQL', 'MongoDB', 'Docker', 'FinTech'],
    image: '/images/projects/paybridge.gif',
    gallery: [
      '/images/projects/paybridge-detail-1.jpg',
      '/images/projects/paybridge-detail-2.jpg',
      '/images/projects/paybridge-detail-3.jpg',
    ],
    technologies: ['Python', 'React.js', 'PostgreSQL', 'MongoDB', 'Docker'],
    achievements: [
      'Processed $1,000+ in transactions during beta',
      'Onboarded 50+ users in initial launch',
      'Reduced transaction fees by 40% compared to traditional methods',
      'Implemented secure authentication and encryption'
    ],
    github: 'https://github.com/ManagementMO/paybridge',
    liveDemo: 'https://paybridgetech.com/',
  }
};

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Find project data
  const project = projectId ? projectsData[projectId as keyof typeof projectsData] : null;
  
  // Use a single useEffect hook to handle redirection if project not found
  React.useEffect(() => {
    if (!project) {
      navigate('/projects');
    }
  }, [navigate, project]);
  
  // If project not found, show loading or return null
  if (!project) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      <Navbar />
      
      <main className="pt-20 pb-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/projects" className="inline-flex items-center text-secondary hover:underline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative rounded-xl overflow-hidden border border-cyber-border">
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg to-transparent opacity-30 z-10"></div>
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-auto object-cover"
                />
                
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex gap-2">
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition"
                      >
                        <Github className="h-4 w-4 text-white" />
                      </a>
                    )}
                    
                    {project.liveDemo && (
                      <a 
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition"
                      >
                        <ExternalLink className="h-4 w-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-3xl font-bold mb-2">
                  {project.title} <span className="text-primary">/ {project.subtitle}</span>
                </h2>
                
                <div className="flex flex-wrap gap-2 my-4">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 text-sm rounded-full bg-cyber-accent/10 text-cyber-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="prose prose-invert max-w-none mt-6">
                  {project.longDescription.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Project Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="w-8 h-px bg-primary mr-2"></span>
                    Project Gallery
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.gallery.map((image, idx) => (
                      <motion.div 
                        key={idx}
                        className="rounded-lg overflow-hidden border border-cyber-border hover:border-primary/50 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                      >
                        <img 
                          src={image} 
                          alt={`${project.title} gallery ${idx+1}`}
                          className="w-full h-auto object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="sticky top-24">
                <div className="rounded-xl border border-cyber-border p-6 bg-black/20 backdrop-blur-sm mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="w-8 h-px bg-secondary mr-2"></span>
                    Technologies
                  </h3>
                  
                  <div className="space-y-4">
                    {project.technologies.map((tech, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-cyber-card/50 border border-cyber-border"
                      >
                        <TechIcon 
                          technology={tech} 
                          className="w-10 h-10 flex-shrink-0"
                        />
                        <span className="font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl border border-cyber-border p-6 bg-black/20 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="w-8 h-px bg-primary mr-2"></span>
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    Key Achievements
                  </h3>
                  
                  <ul className="space-y-2">
                    {project.achievements.map((achievement, idx) => (
                      <li 
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8 space-y-4">
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <FuturisticButton 
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View Source Code
                      </FuturisticButton>
                    </a>
                  )}
                  
                  {project.liveDemo && (
                    <a 
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <FuturisticButton 
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Demo
                      </FuturisticButton>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
