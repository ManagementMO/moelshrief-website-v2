import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
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
      <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
        <nav className="section-container flex items-center justify-between h-14">
          <Link
            to="/"
            className="text-sm font-medium text-stone-900 hover:text-stone-500 transition-colors duration-200"
          >
            mohammed elshrief
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link text-sm ${
                  isActive(link.href)
                    ? 'text-stone-900'
                    : 'text-stone-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.overleaf.com/read/your-cv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors duration-200 border border-stone-300 hover:border-stone-500 px-3 py-1 rounded"
            >
              resume ↗
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-stone-50 pt-14 flex flex-col"
          >
            <nav className="section-container py-10 flex flex-col gap-7">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`block text-2xl font-light transition-colors duration-200 ${
                      isActive(link.href)
                        ? 'text-stone-900'
                        : 'text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <a
                  href="https://www.overleaf.com/read/your-cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-light text-stone-400 hover:text-stone-900 transition-colors duration-200"
                >
                  resume ↗
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
