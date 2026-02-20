import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { Github, Linkedin, ExternalLink, Mail, Send } from 'lucide-react';

const socials = [
  { label: 'linkedin', href: 'https://www.linkedin.com/in/mohammed-elshrief/', icon: Linkedin },
  { label: 'github', href: 'https://github.com/ManagementMO', icon: Github },
  { label: 'devpost', href: 'https://devpost.com/ManagementMO', icon: ExternalLink },
  { label: 'email', href: 'mailto:mkelshri@uwaterloo.ca', icon: Mail },
];

const ContactSection = () => {
  const [state, handleSubmit] = useForm('mvgazbyw');

  return (
    <section id="contact" className="section-container py-12 md:py-16 border-t border-stone-200/80">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-8 font-medium">
          contact
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">
            let's work together.
          </h2>
          <p className="text-stone-500 font-light text-[15px] leading-relaxed">
            Have a project in mind or want to connect? My inbox is always open.
          </p>
        </div>

        {state.succeeded ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-hover p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-medium text-stone-800">message sent</p>
            </div>
            <p className="text-sm text-stone-500 font-light">
              thanks for reaching out — i'll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs text-stone-400 font-medium mb-1.5">
                  name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 placeholder-stone-300 font-light transition-all"
                  placeholder="your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs text-stone-400 font-medium mb-1.5">
                  email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 placeholder-stone-300 font-light transition-all"
                  placeholder="you@example.com"
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs text-stone-400 font-medium mb-1.5">
                subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 placeholder-stone-300 font-light transition-all"
                placeholder="what's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs text-stone-400 font-medium mb-1.5">
                message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 placeholder-stone-300 font-light transition-all resize-none"
                placeholder="tell me about your project..."
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-xs text-red-500 mt-1" />
            </div>

            <button
              type="submit"
              disabled={state.submitting}
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-teal-600 px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              <Send size={13} />
              {state.submitting ? 'sending...' : 'send message'}
            </button>
          </form>
        )}

        <div className="mt-10 pt-8 border-t border-stone-200/80">
          <p className="text-xs text-stone-400 font-medium mb-4">find me here</p>
          <div className="flex items-center gap-5">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="group flex items-center gap-2 text-stone-400 hover:text-teal-700 transition-all duration-300"
              >
                <Icon size={15} className="transition-transform group-hover:scale-110" />
                <span className="text-sm font-light hidden sm:inline-block sm:max-w-0 sm:overflow-hidden sm:group-hover:max-w-[80px] sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
