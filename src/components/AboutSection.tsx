import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const highlights = [
  {
    text: 'Management Engineering student at the',
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
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
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
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-[1.75rem] md:text-[2rem] font-semibold text-stone-900 mb-1.5 leading-[1.2] tracking-tight">
          Mohammed Elshrief
        </h1>
        <p className="text-stone-400 font-light text-sm mb-8">
          Waterloo, ON
        </p>

        <p className="text-stone-600 font-light text-[15px] leading-[1.7] mb-10">
          I build things at the intersection of software, data, and business — then ship
          them. Currently exploring full-stack development, ML, and scalable systems.
        </p>

        <div className="mb-10">
          <p className="section-heading mb-5">what i've been building</p>
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {highlights.map((h, i) => (
              <motion.li
                key={i}
                variants={item}
                className="list-item-hover flex items-start gap-3 text-stone-600 font-light leading-relaxed text-[15px]"
              >
                <span className="diamond-bullet mt-[9px]" />
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
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex items-center gap-6 pt-2"
        >
          <Link
            to="/projects"
            className="text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors group"
          >
            see what i've built
            <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/contact"
            className="text-sm text-stone-400 hover:text-stone-700 transition-colors font-light"
          >
            get in touch
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
