import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { Send } from 'lucide-react';

const ContactSection = () => {
  const [state, handleSubmit] = useForm('mvgazbyw');

  return (
    <section id="contact" className="section-container py-12 md:py-16 border-t border-stone-200/80 dark:border-stone-800/60">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="section-heading mb-8">contact</p>

        {state.succeeded ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-hover p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200">message sent</p>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-light">
              thanks for reaching out — i'll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs text-stone-400 dark:text-stone-500 font-medium mb-1.5">
                  name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 dark:text-stone-200 placeholder-stone-300 dark:placeholder-stone-600 font-light transition-all"
                  placeholder="your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs text-stone-400 dark:text-stone-500 font-medium mb-1.5">
                  email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 dark:text-stone-200 placeholder-stone-300 dark:placeholder-stone-600 font-light transition-all"
                  placeholder="you@example.com"
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-xs text-red-500 mt-1" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs text-stone-400 dark:text-stone-500 font-medium mb-1.5">
                subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 dark:text-stone-200 placeholder-stone-300 dark:placeholder-stone-600 font-light transition-all"
                placeholder="what's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs text-stone-400 dark:text-stone-500 font-medium mb-1.5">
                message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 text-stone-700 dark:text-stone-200 placeholder-stone-300 dark:placeholder-stone-600 font-light transition-all resize-none"
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

      </motion.div>
    </section>
  );
};

export default ContactSection;
