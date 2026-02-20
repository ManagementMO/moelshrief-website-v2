import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const highlights = [
  {
    text: 'Management Engineering student at the',
    link: { label: 'University of Waterloo', href: 'https://uwaterloo.ca', external: true },
    suffix: '.',
  },
  {
    text: 'Built tools used by students and developers.',
    link: null,
    suffix: '',
  },
  {
    text: 'Slightly too obsessed with hackathons, see the damage on',
    link: { label: 'devpost', href: 'https://devpost.com/ManagementMO', external: true },
    suffix: '.',
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
        <h1 className="font-serif text-[1.85rem] md:text-[2.15rem] font-semibold italic text-stone-900 dark:text-stone-100 mb-8 leading-[1.2] tracking-tight" style={{ transform: 'skewX(-12deg)', fontStyle: 'italic' }}>
          Hey, I'm Mohammed
        </h1>

        <p className="text-stone-600 dark:text-stone-300 font-light text-[15px] leading-[1.7] mb-10">
          I build things at the intersection of software, data, and business — then ship
          them. Currently exploring full-stack development, agents in production, and scalable systems.
        </p>

        <div className="mb-10">
          <p className="section-heading mb-5">a little about me</p>
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
                className="list-item-hover flex items-start gap-3 text-stone-600 dark:text-stone-300 font-light leading-relaxed text-[15px]"
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
            className="text-sm font-medium text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors"
          >
            see what i've built
          </Link>
          <span className="text-xs text-stone-300 dark:text-stone-600 font-light italic">or</span>
          <Link
            to="/contact"
            className="text-sm text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors font-light"
          >
            get in touch
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
