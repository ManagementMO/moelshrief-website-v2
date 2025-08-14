import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
// import OpenMeteoWeatherCard from "./OpenMeteoWeatherCard";
import NavbarWeatherCard from "./NavbarWeatherCard";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [hoverLink, setHoverLink] = useState<string | null>(null);

  // Lock scroll on mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section for menu highlighting
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;
      let found = false;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            // Treat both 'about' and 'skills' as 'about' for navbar highlight
            if (section === 'about' || section === 'skills') {
              setActiveSection('about');
            } else {
              setActiveSection(section);
            }
            found = true;
            break;
          }
        }
      }
      // Optionally, if no section is found, fallback to home
      if (!found) setActiveSection('home');
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Use section IDs for both label and logic
  const navLinks = [
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        isScrolled
          ? "backdrop-blur-xl bg-gradient-to-b from-black/70 to-black/50 border-b border-white/10 py-4"
          : "bg-transparent py-6"
      )}
      style={{
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.2)' : 'none',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle animated gradient border at bottom */}
      {isScrolled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      )}

      <div className="container mx-auto px-8 flex justify-between items-center">
        <div className="flex items-center">
          <motion.a
            href="/"
            className="text-xl font-medium group relative"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
              window.scrollTo(0, 0);
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo glow effect */}
            <motion.div
              className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                filter: 'blur(10px)',
              }}
              animate={{
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <span className="relative z-10 text-white font-medium tracking-wide [text-shadow:_0_0_15px_rgb(255_255_255_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(255_255_255_/_90%)]">Mohammed</span>
            <span className="relative z-10 neon-dot text-white [text-shadow:_0_0_15px_rgb(255_255_255_/_100%),_0_0_25px_rgb(255_255_255_/_100%),_0_0_35px_rgb(255_255_255_/_100%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(255_255_255_/_100%),_0_0_30px_rgb(255_255_255_/_100%),_0_0_40px_rgb(255_255_255_/_100%)]">.</span>
            <span className="relative z-10 text-white font-medium tracking-wide [text-shadow:_0_0_15px_rgb(255_255_255_/_70%)] transition-all duration-300 group-hover:[text-shadow:_0_0_20px_rgb(255_255_255_/_90%)]">Elshrief</span>
          </motion.a>

          {/* Weather Card (Beside Name) */}
          <div className="hidden md:block ml-6">
            <NavbarWeatherCard />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ul className="flex space-x-10 mr-8">
            {navLinks.map((link) => (
              <motion.li
                key={link.id}
                className="relative"
                onHoverStart={() => setHoverLink(link.id)}
                onHoverEnd={() => setHoverLink(null)}
              >
                <a
                  href={`#${link.id}`}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-all duration-300 py-2 px-1 relative z-10",
                    activeSection === link.id
                      ? "text-white [text-shadow:_0_0_10px_rgb(255_255_255_/_50%)]"
                      : "text-white/70 hover:text-white"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {link.label}

                  {/* Active indicator with enhanced animation */}
                  {activeSection === link.id && (
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full overflow-hidden"
                      layoutId="navIndicator"
                      transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />

                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                        style={{ width: '200%' }}
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  )}
                </a>

                {/* Hover glow effect */}
                <AnimatePresence>
                  {hoverLink === link.id && activeSection !== link.id && (
                    <motion.div
                      className="absolute inset-0 rounded-lg -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>

          {/* Enhanced resume button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs border border-white/20 bg-black/50 hover:bg-black/50 px-6 py-2.5 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group"
              style={{
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1), 0 0 5px rgba(255, 255, 255, 0.05)',
              }}
              onClick={() => window.open('https://www.overleaf.com/read/ttjwbtkcfmmd#a64414', '_blank')}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [0.8, 1.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />

              {/* Button content with glowing text effect */}
              <span className="mr-2 relative z-10 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8)]">Resume</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download relative z-10 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:[filter:_drop-shadow(0_0_5px_rgba(255,255,255,0.8))]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{
                  width: '200%',
                }}
              />
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white w-12 h-12 relative focus:outline-none z-50 active:scale-95 transition-transform duration-200 rounded-full"
          style={{
            touchAction: 'manipulation',
            background: mobileMenuOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
            boxShadow: mobileMenuOpen ? '0 0 20px rgba(255, 255, 255, 0.1)' : 'none',
            border: mobileMenuOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          whileHover={{
            scale: 1.05,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="block w-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.span
              aria-hidden="true"
              className="block absolute h-0.5 w-8 bg-gradient-to-r from-white/80 to-white transform transition duration-300 ease-in-out"
              animate={{
                rotate: mobileMenuOpen ? 45 : 0,
                translateY: mobileMenuOpen ? 0 : -6,
              }}
              style={{
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
              }}
            />
            <motion.span
              aria-hidden="true"
              className="block absolute h-0.5 w-8 bg-gradient-to-r from-white/80 to-white transform transition duration-300 ease-in-out"
              animate={{
                opacity: mobileMenuOpen ? 0 : 1,
                width: mobileMenuOpen ? 0 : 32,
              }}
              style={{
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
              }}
            />
            <motion.span
              aria-hidden="true"
              className="block absolute h-0.5 w-8 bg-gradient-to-r from-white/80 to-white transform transition duration-300 ease-in-out"
              animate={{
                rotate: mobileMenuOpen ? -45 : 0,
                translateY: mobileMenuOpen ? 0 : 6,
              }}
              style={{
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
              }}
            />
          </div>
        </motion.button>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-0 left-0 w-screen h-screen bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl z-[100] flex flex-col justify-center items-center overflow-y-auto"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
          >
            {/* Enhanced X Close Button */}
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 aspect-square rounded-full border border-white/20 bg-black/80 flex items-center justify-center focus:outline-none z-[200] overflow-hidden"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                boxShadow: '0 0 20px 2px rgba(255,255,255,0.1), 0 0 40px 4px rgba(255,255,255,0.05)',
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 25px 5px rgba(255,255,255,0.15), 0 0 50px 10px rgba(255,255,255,0.1)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
              />

              <span
                className="text-white text-3xl font-bold select-none flex items-center justify-center w-full h-full relative z-10"
                style={{
                  textShadow: '0 0 8px #fff, 0 0 16px #fff',
                  color: '#fff',
                  lineHeight: 1,
                  fontFamily: 'monospace',
                }}
              >
                ×
              </span>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{
                  width: '200%',
                }}
              />
            </motion.button>

            {/* Enhanced mobile menu background effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              {/* Animated gradient background */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/80 to-gray-900/80 opacity-80"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradientAnimation 15s ease infinite',
                }}
              />

              {/* Animated particles */}
              {Array.from({ length: 15 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute rounded-full bg-white/5"
                  style={{
                    width: Math.random() * 4 + 2 + 'px',
                    height: Math.random() * 4 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, Math.random() * 0.3 + 1, 1],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                  }}
                />
              ))}

              {/* Enhanced floating orbs */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md"
                style={{
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.1), inset 0 0 20px rgba(59, 130, 246, 0.1)',
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.div
                className="absolute bottom-1/4 right-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md"
                style={{
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.1), inset 0 0 20px rgba(168, 85, 247, 0.1)',
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, -10, 0],
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              {/* Grid overlay for depth */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            {/* Mobile Weather Card */}
            <div className="flex justify-center w-full mt-8 mb-6 relative z-10 px-4">
              <NavbarWeatherCard />
            </div>

            {/* Enhanced mobile menu links */}
            <div className="flex flex-col items-center w-full relative z-10">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  className="my-3 sm:my-4 relative"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.a
                    href={`#${link.id}`}
                    className="text-2xl sm:text-3xl font-light text-white/90 hover:text-white transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 block rounded-lg relative z-10"
                    style={{
                      minHeight: 48,
                      minWidth: 120,
                      textAlign: 'center',
                      textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    whileHover={{
                      textShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {link.label}
                  </motion.a>

                  {/* Hover background effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(5px)',
                    }}
                  />
                </motion.div>
              ))}

              {/* Enhanced resume button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.1 }}
                className="mt-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="rounded-full border border-white/20 bg-black/50 hover:bg-black/50 px-8 py-6 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group"
                  style={{
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 10px rgba(255, 255, 255, 0.05)',
                  }}
                  onClick={() => {
                    window.open('https://www.overleaf.com/read/ttjwbtkcfmmd#a64414', '_blank');
                    setMobileMenuOpen(false);
                  }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    }}
                    animate={{
                      scale: [0.8, 1.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />

                  {/* Button content with glowing text effect */}
                  <span className="mr-2 relative z-10 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.8)]">Resume</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download relative z-10 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:[filter:_drop-shadow(0_0_5px_rgba(255,255,255,0.8))]">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{
                      width: '200%',
                    }}
                  />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
