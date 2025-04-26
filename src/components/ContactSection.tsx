import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <section 
      id="contact" 
      className="relative py-16 overflow-hidden bg-black"
    >
      {/* Enhanced decorative elements that match the space theme */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
      
      {/* Space-themed background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/50 via-black to-black"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-8 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold mb-6 tracking-tight text-white [text-shadow:_0_0_30px_rgba(255,255,255,0.3)]">
            Let's Connect
          </h2>
          
          <p className="text-white/70 text-lg">
            Have a project in mind or want to discuss a data challenge?
            I'm always open to new opportunities and collaborations.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced contact form */}
            <motion.div 
              className="p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(168, 85, 247, 0.1)',
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-8 text-white [text-shadow:_0_0_20px_rgba(255,255,255,0.2)]">Send a Message</h3>
              
              {isSubmitted ? (
                <motion.div 
                  className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-purple-500/30 mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p className="text-center text-lg font-medium text-white">
                      Thank you for your message! I'll get back to you soon.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-white/80">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-white placeholder:text-white/40"
                        placeholder="John Doe"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-white/80">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-white placeholder:text-white/40"
                        placeholder="john@example.com"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block mb-2 text-sm font-medium text-white/80">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-white placeholder:text-white/40"
                        placeholder="Project Inquiry"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block mb-2 text-sm font-medium text-white/80">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors resize-none text-white placeholder:text-white/40"
                        placeholder="I'd like to discuss a data project..."
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      ></textarea>
                    </div>
                    
                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-lg px-8 py-6 text-sm font-medium tracking-wide shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:translate-y-[-2px] flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
            
            {/* Enhanced contact information */}
            <motion.div 
              className="flex flex-col justify-between"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white [text-shadow:_0_0_20px_rgba(255,255,255,0.2)]">Contact Information</h3>
                
                <div className="space-y-8">
                  <motion.div 
                    className="flex items-start gap-5 p-5 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300"
                    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(168, 85, 247, 0.2)' }}
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Email</h4>
                      <a 
                        href="mailto:mkelshri@uwaterloo.ca" 
                        className="text-white hover:underline font-medium"
                      >
                        mkelshri@uwaterloo.ca
                      </a>
                      <p className="text-sm text-white/60 mt-2">Feel free to email me anytime</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-5 p-5 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300"
                    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(59, 130, 246, 0.2)' }}
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0 border border-blue-500/30 shadow-lg shadow-blue-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Location</h4>
                      <p className="text-white/90 font-medium">University of Waterloo</p>
                      <p className="text-sm text-white/60 mt-2">200 University Ave W, Waterloo, ON N2L 3G1, Canada</p>
                      <p className="text-sm text-white/60 mt-1">Available for remote work globally</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Enhanced social links */}
                <div className="mt-12">
                  <h4 className="font-semibold text-lg mb-6 text-white [text-shadow:_0_0_10px_rgba(255,255,255,0.2)]">Connect with Me</h4>
                  
                  <div className="flex gap-4">
                    <motion.a 
                      href="https://www.linkedin.com/in/mohammed-elshrief/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:border-blue-400/30 group"
                      aria-label="LinkedIn"
                      whileHover={{ 
                        y: -5, 
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(59, 130, 246, 0.3)' 
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </motion.a>
                    
                    <motion.a 
                      href="https://github.com/ManagementMO" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:border-purple-400/30 group"
                      aria-label="GitHub"
                      whileHover={{ 
                        y: -5, 
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(168, 85, 247, 0.3)' 
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </motion.a>
                    
                    <motion.a 
                      href="mailto:mkelshri@uwaterloo.ca" 
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:border-pink-400/30 group"
                      aria-label="Email"
                      whileHover={{ 
                        y: -5, 
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(236, 72, 153, 0.3)' 
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
              
              {/* Enhanced availability box */}
              <motion.div 
                className="mt-12 p-6 rounded-xl border border-white/10 backdrop-blur-md bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                whileHover={{ 
                  y: -5, 
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(168, 85, 247, 0.2)' 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Currently Available</h4>
                    <p className="text-white/60 mt-1">
                      Open to freelance projects and part-time opportunities
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
