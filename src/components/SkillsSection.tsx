import { motion } from 'framer-motion';

const skillCategories = [
  {
    label: 'languages',
    color: 'bg-blue-500',
    skills: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'VBA', 'HTML/CSS'],
  },
  {
    label: 'frameworks & libraries',
    color: 'bg-teal-500',
    skills: ['React', 'Flask', 'NumPy', 'Scikit-learn', 'PyTorch'],
  },
  {
    label: 'data & cloud',
    color: 'bg-amber-500',
    skills: ['PostgreSQL', 'MongoDB', 'Spark', 'Airflow', 'Kafka', 'AWS', 'Azure'],
  },
  {
    label: 'tools & platforms',
    color: 'bg-emerald-500',
    skills: ['Docker', 'Kubernetes', 'Tableau', 'Power BI', 'Git', 'Excel'],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const categoryVariant = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SkillsSection = () => {
  return (
    <section id="skills" className="section-container py-12 md:py-16 border-t border-stone-200/80 dark:border-stone-800/60">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-8 font-medium">
          skills
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {skillCategories.map((category) => (
            <motion.div key={category.label} variants={categoryVariant}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${category.color}`} />
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">{category.label}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[13px] text-stone-600 dark:text-stone-400 font-light border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-1 rounded-full hover:border-teal-300 dark:hover:border-teal-700 hover:text-teal-800 dark:hover:text-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
