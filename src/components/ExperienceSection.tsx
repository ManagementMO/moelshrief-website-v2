import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

const experiences: Experience[] = [
  {
    role: 'Co-Founder & Developer',
    company: 'Paybridge Technologies',
    period: 'oct 2024 — present',
    description: 'Building a full-stack platform to streamline cross-border money transfers. Leading frontend development with React and integrating with payment APIs.',
  },
  {
    role: 'Software Developer',
    company: 'NewHacks 2024',
    period: 'nov 2024',
    description: 'Won 3rd place building Scam-Mah, a real-time scam detection app using Flask, ML, and the Gemini API. Achieved 90% detection accuracy in 24 hours.',
  },
  {
    role: 'Management Engineering Student',
    company: 'University of Waterloo',
    period: 'sep 2023 — present',
    description: 'Studying at the intersection of software engineering, data science, and business systems. Coursework in optimization, data structures, and statistics.',
  },
];

const ExperienceSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % experiences.length);
  const prev = () => setCurrent((c) => (c - 1 + experiences.length) % experiences.length);

  const exp = experiences[current];

  return (
    <section id="experience" className="section-container py-12 md:py-16 border-t border-stone-200/80">
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
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-stone-400 font-light tabular-nums min-w-[32px] text-center">
              {current + 1}/{experiences.length}
            </span>
            <button
              onClick={next}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-all"
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
              className="p-5"
            >
              <div className="mb-4">
                <p className="font-serif text-[15px] font-medium text-stone-900">{exp.company}</p>
                <p className="text-xs text-stone-400 font-light">{exp.period}</p>
              </div>

              <p className="text-[15px] text-stone-600 font-light mb-3">
                {exp.role}
              </p>

              <p className="text-sm text-stone-500 font-light leading-relaxed">
                {exp.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-1 px-5 pb-4">
            {experiences.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 bg-teal-500'
                    : 'w-4 bg-stone-200 hover:bg-stone-300'
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
