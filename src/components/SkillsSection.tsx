import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TechIcon } from "./ui/tech-icon";
import { 
  Database, Code, Server, Cloud, BarChart4, 
  FileCode, PenTool, Brain, BrainCircuit, 
  Boxes, GanttChart
} from "lucide-react";

const SkillsSection = () => {
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Skills data
  const skills = [
    { name: "Data Engineering", level: 95, color: "bg-primary" },
    { name: "Data Analysis", level: 90, color: "bg-secondary" },
    { name: "Machine Learning", level: 85, color: "bg-primary/80" },
    { name: "Data Visualization", level: 92, color: "bg-secondary/80" },
    { name: "Cloud Platforms", level: 88, color: "bg-primary" },
    { name: "SQL & NoSQL", level: 95, color: "bg-secondary" },
  ];
  
  // Technical skills data with custom icons from Lucide
  const technicalSkills = [
    { name: "Python", icon: <img src="/icons/python.svg" alt="Python" className="w-6 h-6" />, color: "bg-blue-500/10" },
    { name: "SQL", icon: <Database className="w-5 h-5 text-orange-400" />, color: "bg-orange-400/10" },
    { name: "Spark", icon: <img src="/icons/spark.svg" alt="Spark" className="w-6 h-6" />, color: "bg-red-500/10" },
    { name: "Airflow", icon: <img src="/icons/airflow.svg" alt="Airflow" className="w-6 h-6" />, color: "bg-green-500/10" },
    { name: "Kafka", icon: <img src="/icons/kafka.svg" alt="Kafka" className="w-6 h-6" />, color: "bg-cyan-500/10" },
    { name: "AWS", icon: <Cloud className="w-5 h-5 text-yellow-400" />, color: "bg-yellow-400/10" },
    { name: "Azure", icon: <Cloud className="w-5 h-5 text-blue-400" />, color: "bg-blue-400/10" },
    { name: "Tableau", icon: <BarChart4 className="w-5 h-5 text-blue-500" />, color: "bg-blue-500/10" },
    { name: "PowerBI", icon: <BarChart4 className="w-5 h-5 text-yellow-500" />, color: "bg-yellow-500/10" },
    { name: "Docker", icon: <img src="/icons/docker.svg" alt="Docker" className="w-6 h-6" />, color: "bg-blue-600/10" },
    { name: "Kubernetes", icon: <img src="/icons/kubernetes.svg" alt="Kubernetes" className="w-6 h-6" />, color: "bg-blue-500/10" },
    { name: "TensorFlow", icon: <BrainCircuit className="w-5 h-5 text-orange-500" />, color: "bg-orange-500/10" },
  ];
  
  // Animate progress bars when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = progressRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              const progressBar = entry.target.querySelector('div:last-child > div') as HTMLElement;
              if (progressBar) {
                progressBar.style.width = `${skills[index].level}%`;
                progressBar.style.opacity = '1';
              }
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    
    progressRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      progressRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [skills]);
  
  return (
    <section 
      id="skills" 
      className="relative py-20 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(155, 135, 245, 0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span 
            className="inline-block px-3 py-1 rounded-full text-sm bg-primary/10 text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            My Skills
          </motion.span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            <div className="tech-expertise-container">
              <span className="text-white font-bold tracking-wide [text-shadow:_0_0_10px_rgb(255_255_255_/_70%),_0_0_20px_rgb(255_255_255_/_50%),_0_0_30px_rgb(255_255_255_/_30%)]">Technical Expertise</span>
            </div>
          </h2>
          
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            With a strong foundation in data engineering and analysis, I've developed a versatile skill set
            that enables me to tackle complex data challenges and deliver valuable insights.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Skills with progress bars */}
          <div>
            <motion.h3 
              className="text-2xl font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Core Competencies
            </motion.h3>
            
            <div className="space-y-8">
              {skills.map((skill, index) => (
                <motion.div 
                  key={skill.name}
                  ref={el => progressRefs.current[index] = el}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-primary">{skill.level}%</span>
                  </div>
                  
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${skill.color} opacity-0 rounded-full`}
                      style={{ width: "0%" }}
                      whileHover={{ filter: "brightness(1.2)" }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Technical skills grid with custom TechIcon component */}
          <div>
            <motion.h3 
              className="text-2xl font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Technologies & Tools
            </motion.h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {technicalSkills.map((skill, index) => (
                <TechIcon 
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  color={skill.color}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 3D Data flow visualization */}
        <motion.div 
          className="mt-20 relative h-32 overflow-hidden rounded-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 backdrop-blur-sm"></div>
          
          {/* Animated data streams */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute h-1 bg-primary/40 rounded-full"
                initial={{
                  left: '-100px',
                  top: `${Math.random() * 100}%`,
                  width: `${30 + Math.random() * 100}px`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
                animate={{
                  left: '100%',
                  opacity: [0.3 + Math.random() * 0.7, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  ease: "linear",
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              ></motion.div>
            ))}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <motion.p 
              className="text-xl font-medium text-glow"
              animate={{
                textShadow: [
                  "0 0 8px rgba(155, 135, 245, 0.4)",
                  "0 0 16px rgba(155, 135, 245, 0.6)",
                  "0 0 8px rgba(155, 135, 245, 0.4)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Transforming raw data into actionable intelligence
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
