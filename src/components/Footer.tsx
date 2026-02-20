import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="section-container py-10 border-t border-stone-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-stone-400 font-light">
          © {year} Mohammed Elshrief
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ManagementMO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors font-light"
          >
            github
          </a>
          <a
            href="https://www.linkedin.com/in/mohammed-elshrief/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors font-light"
          >
            linkedin
          </a>
          <a
            href="mailto:mkelshri@uwaterloo.ca"
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors font-light"
          >
            email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
