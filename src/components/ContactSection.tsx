import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';

const socials = [
  { label: 'linkedin', href: 'https://www.linkedin.com/in/mohammed-elshrief/', icon: Linkedin },
  { label: 'github', href: 'https://github.com/ManagementMO', icon: Github },
  { label: 'devpost', href: 'https://devpost.com/ManagementMO', icon: ExternalLink },
];

const ContactSection = () => {
  const [state, handleSubmit] = useForm('mvgazbyw');

  return (
    <section id="contact" className="section-container py-16 md:py-20 border-t border-stone-200">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-6 font-medium">
          contact
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-stone-900 mb-2">let's work together.</h2>
          <p className="text-stone-500 font-light text-sm leading-relaxed">
            Have a project in mind or want to connect? My inbox is always open.
          </p>
        </div>

        <div className="flex items-center gap-1 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 relative">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </span>
          <span className="text-xs text-stone-500 font-light ml-2">available for opportunities</span>
        </div>

        {state.succeeded ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-stone-200 rounded-lg p-5 bg-white/50"
          >
            <p className="text-sm text-stone-700 font-light">
              thanks for reaching out — i'll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs text-stone-400 font-light mb-1.5">
                  name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 text-sm bg-white/50 border border-stone-200 rounded focus:outline-none focus:border-stone-400 text-stone-700 placeholder-stone-300 font-light transition-colors"
                  placeholder="your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs text-stone-400 font-light mb-1.5">
                  email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 text-sm bg-white/50 border border-stone-200 rounded focus:outline-none focus:border-stone-400 text-stone-700 placeholder-stone-300 font-light transition-colors"
                  placeholder="you@example.com"
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs text-stone-400 font-light mb-1.5">
                subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                required
                className="w-full px-3 py-2 text-sm bg-white/50 border border-stone-200 rounded focus:outline-none focus:border-stone-400 text-stone-700 placeholder-stone-300 font-light transition-colors"
                placeholder="what's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs text-stone-400 font-light mb-1.5">
                message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full px-3 py-2 text-sm bg-white/50 border border-stone-200 rounded focus:outline-none focus:border-stone-400 text-stone-700 placeholder-stone-300 font-light transition-colors resize-none"
                placeholder="tell me about your project..."
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-red-500 mt-1" />
            </div>

            <button
              type="submit"
              disabled={state.submitting}
              className="text-sm font-medium text-stone-900 border border-stone-300 px-4 py-2 rounded hover:bg-stone-900 hover:text-stone-50 hover:border-stone-900 transition-all duration-200 disabled:opacity-50"
            >
              {state.submitting ? 'sending...' : 'send message'}
            </button>
          </form>
        )}

        <div className="mt-10 pt-8 border-t border-stone-200">
          <p className="text-xs text-stone-400 font-light mb-4">or find me at</p>
          <div className="flex items-center gap-5">
            <a
              href="mailto:mkelshri@uwaterloo.ca"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors font-light"
            >
              mkelshri@uwaterloo.ca
            </a>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-all duration-200 hover:scale-110 group"
              >
                <Icon size={14} className="transition-transform group-hover:scale-110" />
                <span className="font-light">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
