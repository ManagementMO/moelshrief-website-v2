import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Search } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  github?: string;
  live?: string;
  stats?: string[];
}

const projects: Project[] = [
  {
    id: 'vba-finance-tool',
    title: 'MO-Planner',
    description: 'Comprehensive financial planning application built with Excel/VBA featuring automated calculations, expense tracking, budget forecasting, and dynamic financial reporting.',
    tags: ['Excel', 'VBA', 'Python'],
    image: '/images/projects/vba-finance-tool.jpg',
    github: 'https://github.com/ManagementMO/VBA-Financial-Planning-Tool',
    stats: ['90% accuracy', '100+ users'],
  },
  {
    id: 'focusforge',
    title: 'FocusForge',
    description: 'Full-stack productivity suite with dynamic calendar integration, task management, automated calculations, and AI-powered insights via the Gemini API.',
    tags: ['Excel', 'VBA', 'Gemini API'],
    image: '/images/projects/focusforge.jpg',
    live: 'https://jasooh.github.io/mse-100-launch-page/',
    stats: ['AI Integration', 'Dynamic Calendar'],
  },
  {
    id: 'scam-mah',
    title: 'Scam-Mah',
    description: 'Real-time spam detection web app using Flask and machine learning with pattern analysis and API integration. Built in 24 hours at NewHacks 2024.',
    tags: ['Python', 'Flask', 'ML', 'Gemini API'],
    image: '/images/projects/scam-mah.jpg',
    live: 'https://devpost.com/software/scam-mah',
    stats: ['90% accuracy', '3rd Place @ NewHacks'],
  },
  {
    id: 'pay-bridge',
    title: 'Paybridge Technologies',
    description: 'Full-stack web application streamlining money transfers between financial institutions, focused on simplifying cross-border transactions.',
    tags: ['Python', 'React', 'PostgreSQL', 'Docker'],
    image: '/images/projects/pay-bridge.jpg',
    live: 'https://paybridgetech.com/',
    stats: ['50+ beta users', '$1,000+ transactions'],
  },
];

const ProjectsSection = () => {
  const [search, setSearch] = useState('');
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <section id="projects" className="section-container py-16 md:py-20 border-t border-stone-200">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-6 font-medium">
          projects
        </p>

        <div className="relative mb-8">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-transparent border border-stone-200 rounded focus:outline-none focus:border-stone-400 text-stone-700 placeholder-stone-400 font-light transition-colors"
          />
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                imageLoaded={imageLoaded[project.id] ?? false}
                onImageLoad={() => setImageLoaded(prev => ({ ...prev, [project.id]: true }))}
              />
            ))}
            {filtered.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-stone-400 text-sm font-light py-4"
              >
                no projects match "{search}"
              </motion.p>
            )}
          </div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-stone-200"
        >
          <a
            href="https://github.com/ManagementMO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors font-light"
          >
            more on github →
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  imageLoaded: boolean;
  onImageLoad: () => void;
}

const ProjectCard = ({ project, index, imageLoaded, onImageLoad }: ProjectCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.06 }}
      className="group border border-stone-200 rounded-lg overflow-hidden hover:border-stone-300 transition-colors bg-white/50"
    >
      <div className="overflow-hidden">
        <div
          className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
            imageLoaded ? 'h-0 group-hover:h-40' : 'h-0 group-hover:h-40'
          }`}
        >
          {!imageLoaded && (
            <div className="w-full h-40 project-image-shimmer" />
          )}
          <img
            src={project.image}
            alt={project.title}
            onLoad={onImageLoad}
            className={`w-full h-40 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-700 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors hover:bg-stone-100 rounded"
                aria-label="GitHub"
              >
                <Github size={14} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors hover:bg-stone-100 rounded"
                aria-label="Live link"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <p className="text-xs text-stone-500 font-light leading-relaxed mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs text-stone-400 font-light">
              {tag}
            </span>
          ))}
          {project.stats && project.stats.length > 0 && (
            <>
              <span className="text-stone-200">·</span>
              {project.stats.map(stat => (
                <span key={stat} className="text-xs text-stone-500 font-light">
                  {stat}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsSection;
