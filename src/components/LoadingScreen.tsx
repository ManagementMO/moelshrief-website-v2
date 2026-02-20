import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: '#fafaf9',
        backgroundImage: 'radial-gradient(circle, rgba(168, 162, 158, 0.2) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-teal-500 block"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
        <motion.span
          className="text-xs text-stone-400 font-serif italic tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          loading
        </motion.span>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
