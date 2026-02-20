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

const tagColors: Record<string, string> = {
  Python: 'text-blue-700 bg-blue-50 border-blue-200',
  React: 'text-sky-700 bg-sky-50 border-sky-200',
  Flask: 'text-stone-700 bg-stone-50 border-stone-200',
  ML: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Gemini API': 'text-amber-700 bg-amber-50 border-amber-200',
  Excel: 'text-green-700 bg-green-50 border-green-200',
  VBA: 'text-green-700 bg-green-50 border-green-200',
  PostgreSQL: 'text-blue-700 bg-blue-50 border-blue-200',
  Docker: 'text-sky-700 bg-sky-50 border-sky-200',
};

const defaultTagColor = 'text-stone-600 bg-stone-50 border-stone-200';

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
    <section id="projects" className="section-container py-12 md:py-16 border-t border-stone-200/80">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-8 font-medium">
          projects
        </p>

        <div className="relative mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 placeholder-stone-400 font-light transition-all"
          />
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-3">
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
                className="text-stone-400 text-sm font-light py-6 text-center"
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
          className="mt-8 pt-6 border-t border-stone-200/80"
        >
          <a
            href="https://github.com/ManagementMO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-700 hover:text-teal-900 transition-colors font-medium group"
          >
            more on github
            <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
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
      transition={{ delay: index * 0.05 }}
      className="group card-hover overflow-hidden"
    >
      <div className="overflow-hidden">
        <div className="w-full transition-all duration-500 ease-in-out overflow-hidden h-0 group-hover:h-44">
          {!imageLoaded && (
            <div className="w-full h-44 project-image-shimmer" />
          )}
          <img
            src={project.image}
            alt={project.title}
            onLoad={onImageLoad}
            className={`w-full h-44 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-[15px] font-medium text-stone-900 group-hover:text-teal-800 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors hover:bg-stone-100 rounded"
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
                className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors hover:bg-stone-100 rounded"
                aria-label="Live link"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-stone-500 font-light leading-relaxed mb-3.5">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${tagColors[tag] || defaultTagColor}`}
            >
              {tag}
            </span>
          ))}
          {project.stats && project.stats.length > 0 && (
            <>
              <span className="text-stone-200 mx-0.5">|</span>
              {project.stats.map(stat => (
                <span key={stat} className="text-[11px] text-stone-500 font-light">
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
