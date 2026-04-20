import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import NavSignature from './NavSignature';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'about' },
  // { href: '/projects', label: 'projects' },
  { href: '/contact', label: 'contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 transition-colors duration-300">
        <nav className="section-container flex items-center justify-between h-14">
          <Link
            to="/"
            className="text-stone-900 dark:text-stone-100 hover:text-teal-700 dark:hover:text-teal-400 transition-colors duration-300 flex items-center"
            aria-label="Home"
          >
            <NavSignature />
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link text-[13px] tracking-wide ${
                  isActive(link.href)
                    ? 'text-stone-900 dark:text-stone-100 font-medium'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm pt-14 transition-colors duration-300"
          >
            <nav className="section-container py-12 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                >
                  <Link
                    to={link.href}
                    className={`block py-3 font-serif text-2xl font-light tracking-tight transition-colors duration-200 ${
                      isActive(link.href)
                        ? 'text-stone-900 dark:text-stone-100'
                        : 'text-stone-400 dark:text-stone-500 hover:text-teal-700 dark:hover:text-teal-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.06 + 0.1 }}
                className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800"
              >
                <div className="flex items-center gap-5">
                  <a
                    href="https://github.com/ManagementMO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-400 dark:text-stone-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                  >
                    github
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mohammed-elshrief/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-400 dark:text-stone-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                  >
                    linkedin
                  </a>
                  <a
                    href="mailto:mkelshri@uwaterloo.ca"
                    className="text-sm text-stone-400 dark:text-stone-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                  >
                    email
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
