import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Experience {
  role: string;
  company: string;
  period: string;
  logo: string;
}

const experiences: Experience[] = [
  {
    role: 'Data Scientist Intern',
    company: 'Altas Partners',
    period: 'jan 2026 — present',
    logo: '/logos/altas.png',
  },
  {
    role: 'Machine Learning Engineer',
    company: 'WAT.ai',
    period: 'sep 2025 — present',
    logo: '/logos/watai.png',
  },
  {
    role: 'Software Engineer Intern',
    company: 'LiftWerx',
    period: 'may 2025 — aug 2025',
    logo: '/logos/liftwerx.png',
  },
  {
    role: 'Machine Learning Developer',
    company: 'Themis AI (UTMIST)',
    period: 'may 2025 — aug 2025',
    logo: '/logos/utmist.svg',
  },
];

const ExperienceSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % experiences.length);
  const prev = () => setCurrent((c) => (c - 1 + experiences.length) % experiences.length);

  const exp = experiences[current];

  return (
    <section id="experience" className="section-container py-12 md:py-16 border-t border-stone-200/80 dark:border-stone-800/60">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <p className="section-heading">where i've been</p>
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-stone-400 dark:text-stone-500 font-light tabular-nums min-w-[32px] text-center">
              {current + 1}/{experiences.length}
            </span>
            <button
              onClick={next}
              className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-all"
              aria-label="Next"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="card-hover overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-4"
            >
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5 bg-stone-200/70 dark:bg-stone-700/50">
                  <img
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className="w-full h-full object-contain rounded-md dark:brightness-150"
                  />
                </div>
                <div>
                  <p className="font-serif text-[15px] font-medium text-stone-900 dark:text-stone-100">{exp.company}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-light">{exp.period}</p>
                </div>
              </div>

              <p className="text-[15px] text-stone-600 dark:text-stone-300 font-light">
                {exp.role}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-1 px-4 pb-3">
            {experiences.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 bg-teal-500'
                    : 'w-4 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                }`}
                aria-label={`Go to experience ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ExperienceSection;
