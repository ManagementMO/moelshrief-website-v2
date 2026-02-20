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

const AboutSection = () => {
  return (
    <section id="about" className="section-container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-6 font-medium">
          about
        </p>

        <h1 className="text-3xl font-semibold text-stone-900 mb-8 leading-tight">
          hi, i'm mohammed.
        </h1>

        <ul className="space-y-3 mb-10">
          {highlights.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
              className="list-item-hover flex items-start gap-3 text-stone-600 font-light leading-relaxed"
            >
              <span className="bullet-hover mt-[7px] w-[5px] h-[5px] flex-shrink-0 bg-stone-400 block" />
              <span>
                {item.text}{' '}
                {item.link && (
                  item.link.external ? (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-900 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-600 transition-colors"
                    >
                      {item.link.label}
                    </a>
                  ) : (
                    <Link
                      to={item.link.href}
                      className="text-stone-900 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-600 transition-colors"
                    >
                      {item.link.label}
                    </Link>
                  )
                )}
                {item.suffix}
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-stone-200"
        >
          <p className="text-stone-500 font-light text-sm leading-relaxed mb-6">
            I'm in my second year studying Management Engineering at UWaterloo — a program at the
            intersection of software, systems, and business. I spend most of my time building
            things, lifting weights, and listening to music while debugging at 2am.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/projects"
              className="text-sm text-stone-900 font-medium underline underline-offset-2 decoration-stone-300 hover:decoration-stone-700 transition-colors"
            >
              view projects →
            </Link>
            <Link
              to="/contact"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors font-light"
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
