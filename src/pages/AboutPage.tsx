import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DownloadIcon, LinkedinIcon, GithubIcon, ExternalLinkIcon } from 'lucide-react';
import { FuturisticButton } from '@/components/ui/futuristic-button';

const AboutPage: React.FC = () => {
  const skills = {
    languages: ["Python", "R", "SQL", "Excel", "VBA", "Power BI", "Tableau"],
    libraries: ["Numpy", "Pandas", "Matplotlib", "PyTorch", "Keras"],
    tools: ["Git", "Docker", "Kubernetes", "JupyterLab", "SAP", "AWS", "VS Code"]
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      <Navbar />
      
      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4">
          {/* Skills Section */}
          <section className="mb-20">
            <motion.h2 
              className="text-3xl font-bold mb-8 flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="w-10 h-px bg-cyber-accent mr-3"></span>
              Technical Skills
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-cyber-card/30 backdrop-blur-sm border border-cyber-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 text-primary">Languages & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-cyber-card/30 backdrop-blur-sm border border-cyber-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-xl font-bold mb-4 text-secondary">Libraries & Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.libraries.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-secondary/10 text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-cyber-card/30 backdrop-blur-sm border border-cyber-border rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-4 text-cyber-accent">Development Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-cyber-accent/10 text-cyber-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
