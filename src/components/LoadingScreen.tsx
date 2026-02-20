import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-stone-50 flex items-center justify-center"
      style={{
        backgroundImage: 'radial-gradient(circle, #c7beb5 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="text-sm text-stone-400 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          loading
        </motion.span>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-stone-400 block"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
