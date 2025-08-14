
import { useEffect } from 'react';

/**
 * Hook to reveal elements as they scroll into view
 * @param options Configuration options for the reveal effect
 */
export function useScrollReveal(options = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
  once: true
}) {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-sequential');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // If once is true, unobserve after revealing
          if (options.once) {
            observer.unobserve(entry.target);
          }
        } else if (!options.once) {
          // If once is false, hide again when out of view
          entry.target.classList.remove('active');
        }
      });
    }, {
      threshold: options.threshold,
      rootMargin: options.rootMargin
    });
    
    revealElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      revealElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [options.threshold, options.rootMargin, options.once]);
}

export default useScrollReveal;
