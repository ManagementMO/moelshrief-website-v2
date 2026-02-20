import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const highlights = [
  {
    text: 'Software Engineer & Management Engineering student at the',
    link: { label: 'University of Waterloo', href: 'https://uwaterloo.ca', external: true },
    suffix: '.',
  },
  {
    text: 'Built tools used by students and developers — from AI-powered apps to financial automation.',
    link: null,
    suffix: '',
  },
  {
    text: '3rd Place at',
    link: { label: 'NewHacks 2024', href: 'https://devpost.com/ManagementMO', external: true },
    suffix: ' with a real-time scam detection app achieving 90% accuracy.',
  },
  {
    text: 'Currently co-building',
    link: { label: 'Paybridge Technologies', href: 'https://paybridgetech.com/', external: true },
    suffix: ' — simplifying cross-border money transfers.',
  },
  {
    text: 'Open to freelance work and meaningful collaborations.',
    link: null,
    suffix: '',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const AboutSection = () => {
  return (
    <section id="about" className="section-container pt-16 pb-12 md:pt-24 md:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-2 h-2 rounded-full bg-teal-500 relative">
            <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-50" />
          </div>
          <span className="text-xs text-stone-400 tracking-widest uppercase font-medium">
            available for work
          </span>
        </div>

        <h1 className="text-[2rem] md:text-[2.5rem] font-semibold text-stone-900 mb-3 leading-[1.15] tracking-tight">
          hey, i'm mohammed.
        </h1>
        <p className="text-stone-500 font-light text-[15px] leading-relaxed mb-10 max-w-[440px]">
          i build things at the intersection of software, data, and business
          — then ship them.
        </p>

        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3.5 mb-12"
        >
          {highlights.map((h, i) => (
            <motion.li
              key={i}
              variants={item}
              className="list-item-hover flex items-start gap-3 text-stone-600 font-light leading-relaxed text-[15px]"
            >
              <span className="bullet-hover mt-[8px] w-[5px] h-[5px] flex-shrink-0 bg-stone-300 block" />
              <span>
                {h.text}{' '}
                {h.link && (
                  h.link.external ? (
                    <a
                      href={h.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="accent-link"
                    >
                      {h.link.label}
                    </a>
                  ) : (
                    <Link to={h.link.href} className="accent-link">
                      {h.link.label}
                    </Link>
                  )
                )}
                {h.suffix}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="pt-8 border-t border-stone-200/80"
        >
          <p className="text-stone-500 font-light text-sm leading-[1.7] mb-6">
            Second-year Management Engineering at UWaterloo — a program at the intersection of
            software, systems, and business. I spend most of my time building things, lifting
            weights, and listening to music while debugging at 2am.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/projects"
              className="text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors group"
            >
              see what i've built
              <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              to="/contact"
              className="text-sm text-stone-400 hover:text-stone-700 transition-colors font-light"
            >
              get in touch
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
