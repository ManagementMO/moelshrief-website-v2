import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FuturisticButton } from '@/components/ui/futuristic-button';
import { Mail, Phone, MapPin, Send, Linkedin, Github, ExternalLink } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      <Navbar />
      
      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-primary/10 text-primary mb-4">
              Let's Connect
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get In <span className="text-secondary">Touch</span>
            </h1>
            
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              Have a project in mind or want to discuss potential collaborations?
              I'm always open to new opportunities and challenges.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-8 bg-cyber-card/30 backdrop-blur-sm rounded-xl border border-cyber-border">
                <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium">
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-cyber-bg/50 border border-cyber-border/50 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                        required
                      />
                      <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 hover:opacity-100 overflow-hidden">
                        <div className="absolute inset-[-2px] border border-primary/20 rounded-lg opacity-0 animate-pulse-glow-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                      Your Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-cyber-bg/50 border border-cyber-border/50 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                        required
                      />
                      <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 hover:opacity-100 overflow-hidden">
                        <div className="absolute inset-[-2px] border border-primary/20 rounded-lg opacity-0 animate-pulse-glow-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                      Subject
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        className="w-full p-3 bg-cyber-bg/50 border border-cyber-border/50 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                        required
                      />
                      <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 hover:opacity-100 overflow-hidden">
                        <div className="absolute inset-[-2px] border border-primary/20 rounded-lg opacity-0 animate-pulse-glow-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">
                      Your Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        className="w-full p-3 bg-cyber-bg/50 border border-cyber-border/50 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                        required
                      ></textarea>
                      <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 hover:opacity-100 overflow-hidden">
                        <div className="absolute inset-[-2px] border border-primary/20 rounded-lg opacity-0 animate-pulse-glow-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <FuturisticButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      glowEffect={true}
                      className="w-full mt-4"
                      disabled={isSubmitting || isSubmitted}
                    >
                      {isSubmitting ? (
                        <>Sending Message...</>
                      ) : isSubmitted ? (
                        <>Message Sent Successfully!</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </FuturisticButton>
                  </div>
                </form>
              </div>
            </motion.div>
            
            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Email</h3>
                        <a 
                          href="mailto:elshrief.mo@gmail.com" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          elshrief.mo@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-secondary/10">
                        <Phone className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Phone</h3>
                        <a 
                          href="tel:+12269727549" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          +1 (226) 972-7549
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Location</h3>
                        <p className="text-muted-foreground">
                          Waterloo, ON, Canada
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-6">Follow Me</h2>
                  
                  <div className="flex gap-4">
                    <a 
                      href="https://linkedin.com/in/mohammed-elshrief" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-cyber-card/30 backdrop-blur-sm border border-cyber-border hover:border-primary/50 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-primary" />
                    </a>
                    
                    <a 
                      href="https://github.com/ManagementMO" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-cyber-card/30 backdrop-blur-sm border border-cyber-border hover:border-secondary/50 transition-colors"
                    >
                      <Github className="w-5 h-5 text-secondary" />
                    </a>
                    
                    <a 
                      href="https://moelshrief.wiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-cyber-card/30 backdrop-blur-sm border border-cyber-border hover:border-cyber-accent/50 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-cyber-accent" />
                    </a>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="relative h-60 mt-8 rounded-xl overflow-hidden border border-cyber-border">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
                  
                  {/* Data visualization lines */}
                  {[...Array(10)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="absolute h-px bg-primary/30"
                      style={{
                        top: `${10 + (i * 8)}%`,
                        left: 0,
                        right: 0,
                        opacity: 0.1 + (i * 0.05),
                      }}
                      animate={{
                        opacity: [0.1 + (i * 0.05), 0.3 + (i * 0.05), 0.1 + (i * 0.05)],
                        scaleX: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3 + (i % 4),
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div 
                        className="text-2xl font-bold mb-2"
                        animate={{
                          textShadow: [
                            "0 0 8px hsl(var(--primary) / 0.3)",
                            "0 0 16px hsl(var(--primary) / 0.6)",
                            "0 0 8px hsl(var(--primary) / 0.3)",
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Let's Build Something <br /> Amazing Together
                      </motion.div>
                    </div>
                  </div>
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

export default ContactPage;
