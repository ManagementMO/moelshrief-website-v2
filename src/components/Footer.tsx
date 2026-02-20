import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

const socialLinks = [
  { icon: Github, label: 'github', href: 'https://github.com/ManagementMO' },
  { icon: Linkedin, label: 'linkedin', href: 'https://www.linkedin.com/in/mohammed-elshrief/' },
  { icon: Mail, label: 'email', href: 'mailto:mkelshri@uwaterloo.ca' },
  { icon: Code2, label: 'source', href: 'https://github.com/ManagementMO/moelshrief-website-v2' },
];

const Footer = () => {
  return (
    <footer className="section-container py-10 border-t border-stone-200/80 dark:border-stone-800/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-6">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="group flex items-center text-stone-400 dark:text-stone-500 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-300 hover:scale-110"
            >
              <Icon size={18} />
              <span className="text-xs font-light hidden md:inline-block md:w-0 md:overflow-hidden md:group-hover:w-auto md:group-hover:ml-1.5 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap">
                {label}
              </span>
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
