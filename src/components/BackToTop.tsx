import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2 text-stone-400 hover:text-stone-900 border border-stone-200 hover:border-stone-400 rounded bg-stone-50/90 backdrop-blur-sm transition-all duration-200 z-40"
          aria-label="Back to top"
        >
          <ArrowUp size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
