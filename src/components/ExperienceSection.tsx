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
    role: 'Data Scientist Intern',
    company: 'Altas Partners',
    period: 'jan 2026 — present',
    description: 'Scraping the internet so private equity analysts don\'t have to. Built pipelines that turn a firehose of messy data into something actually useful.',
  },
  {
    role: 'Machine Learning Engineer',
    company: 'WAT.ai',
    period: 'sep 2025 — present',
    description: 'Building AI that\'s fast, doesn\'t hallucinate (too much), and can tell when something sketchy is happening on camera. Part research, part duct tape.',
  },
  {
    role: 'Software Engineer Intern',
    company: 'LiftWerx',
    period: 'may 2025 — aug 2025',
    description: 'Taught a GPT to know everything about aircraft maintenance so technicians wouldn\'t have to dig through manuals. Also wrangled a fleet of AI agents to do planning work that used to take days.',
  },
  {
    role: 'Machine Learning Engineer Intern',
    company: 'Themis AI (UTMIST)',
    period: 'may 2025 — aug 2025',
    description: 'Made labeling data less painful and more intelligent. Shipped an open-source tool that apparently people actually use — which is always a pleasant surprise.',
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
