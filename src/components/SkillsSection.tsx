import { motion } from 'framer-motion';

const skillCategories = [
  {
    label: 'Languages',
    skills: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'VBA', 'HTML/CSS'],
  },
  {
    label: 'Frameworks & Libraries',
    skills: ['React', 'Flask', 'NumPy', 'Scikit-learn', 'PyTorch'],
  },
  {
    label: 'Data & Cloud',
    skills: ['PostgreSQL', 'MongoDB', 'Spark', 'Airflow', 'Kafka', 'AWS', 'Azure'],
  },
  {
    label: 'Tools & Platforms',
    skills: ['Docker', 'Kubernetes', 'Tableau', 'Power BI', 'Git', 'Excel'],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section-container py-16 md:py-20 border-t border-stone-200">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-6 font-medium">
          skills
        </p>

        <div className="space-y-6">
          {skillCategories.map((category, ci) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.08 }}
            >
              <p className="text-xs text-stone-400 font-light mb-2">{category.label}</p>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.08 + si * 0.03 }}
                    className="text-sm text-stone-600 font-light border border-stone-200 px-2.5 py-1 rounded hover:border-stone-400 hover:text-stone-900 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
