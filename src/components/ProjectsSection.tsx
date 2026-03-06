import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Search } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

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
    tags: ['Python', 'Flask', 'Gemini API'],
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
    stats: ['$1,000+ transaction volume'],
  },
];

const tagColors: Record<string, string> = {
  Python: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  React: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800',
  Flask: 'text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700',
  'Gemini API': 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  Excel: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  VBA: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  PostgreSQL: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  Docker: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800',
};

const defaultTagColor = 'text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700';

const tagIcons: Record<string, React.ReactNode> = {
  Python: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M11.75,2.5c-5.69,0-5.32,2.46-5.32,2.46l.01,2.55h5.42v.77H4.11s-3.69-.4-3.69,5.38,3.22,5.58,3.22,5.58h1.92V16.4s-.1-3.22,3.17-3.22h5.47s3.07.05,3.07-2.97V5.43s.51-2.93-5.52-2.93m-3.03,1.7a.98.98,0,1,1-.98.98.98.98,0,0,1,.98-.98" fill="#366A96"/>
      <path d="M12.22,21.5c5.69,0,5.32-2.46,5.32-2.46l-.01-2.55H12.11v-.77h7.76s3.69.4,3.69-5.38S20.33,4.75,20.33,4.75H18.4V7.6s.1,3.22-3.17,3.22H9.77s-3.07-.05-3.07,2.97v4.78s-.51,2.93,5.52,2.93m3.03-1.7a.98.98,0,1,1,.98-.98.98.98,0,0,1-.98.98" fill="#FFC331"/>
    </svg>
  ),
  React: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.5" fill="#61DAFB"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  ),
  Flask: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 3h6M12 3v7m-5 4c-1.5 2-2 4-2 6h14c0-2-.5-4-2-6l-3-4H10l-3 4z"/>
    </svg>
  ),
'Gemini API': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" fill="#4285F4" opacity="0.9"/>
    </svg>
  ),
  Excel: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#107C41"/>
      <path d="M7 8l4 4-4 4M13 8l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  VBA: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  PostgreSQL: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="8" rx="8" ry="4" stroke="#336791" strokeWidth="1.5" fill="none"/>
      <path d="M4 8v8c0 2.2 3.6 4 8 4s8-1.8 8-4V8" stroke="#336791" strokeWidth="1.5" fill="none"/>
      <path d="M4 12c0 2.2 3.6 4 8 4s8-1.8 8-4" stroke="#336791" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Docker: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect x="13" y="4" width="3" height="3" fill="#2496ED"/>
      <rect x="8" y="4" width="3" height="3" fill="#2496ED"/>
      <rect x="3" y="4" width="3" height="3" fill="#2496ED"/>
      <rect x="8" y="8" width="3" height="3" fill="#2496ED"/>
      <rect x="3" y="8" width="3" height="3" fill="#2496ED"/>
      <rect x="13" y="8" width="3" height="3" fill="#2496ED"/>
      <rect x="18" y="8" width="3" height="3" fill="#2496ED"/>
      <path d="M1 14c0 0 1.5 5 8.5 5s9.5-3 11-5c-1 .5-2.5 1-4 1-3 0-4-1.5-4-1.5" stroke="#2496ED" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
};

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
    <section id="projects" className="section-container py-12 md:py-16 border-t border-stone-200/80 dark:border-stone-800/60">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-8 font-medium">
          projects
        </p>

        <div className="relative mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            placeholder="search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 font-light transition-all"
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
                className="text-stone-400 dark:text-stone-500 text-sm font-light py-6 text-center"
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
          className="mt-8 pt-6 border-t border-stone-200/80 dark:border-stone-800/60"
        >
          <a
            href="https://github.com/ManagementMO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors font-medium group"
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
      className="group relative rounded-2xl border border-stone-200/80 dark:border-stone-700/50 p-2 transition-all duration-300 hover:border-stone-300/80 dark:hover:border-stone-600/60"
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
      <div className="relative overflow-hidden rounded-xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border border-stone-100 dark:border-stone-800/60 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
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
            <h3 className="text-[15px] font-medium text-stone-900 dark:text-stone-100 group-hover:text-teal-800 dark:group-hover:text-teal-400 transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
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
                  className="p-1.5 text-stone-400 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
                  aria-label="Live link"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-3.5">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${tagColors[tag] || defaultTagColor}`}
              >
                {tagIcons[tag] && <span className="flex-shrink-0">{tagIcons[tag]}</span>}
                {tag}
              </span>
            ))}
            {project.stats && project.stats.length > 0 && (
              <>
                <span className="text-stone-200 dark:text-stone-700 mx-0.5">|</span>
                {project.stats.map(stat => (
                  <span key={stat} className="text-[11px] text-stone-500 dark:text-stone-400 font-light">
                    {stat}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsSection;
