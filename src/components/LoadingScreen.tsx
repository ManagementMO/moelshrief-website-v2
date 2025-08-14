import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const robotText = [
  'Initializing neural interface...',
  'Syncing data streams...',
  'Calibrating experience...',
  'Welcome to the future.'
];

const stepDuration = 1000; // ms, for a total of ~4s

const LoadingScreen = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < robotText.length - 1) {
      const t = setTimeout(() => setStep(step + 1), stepDuration);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Ensures the loader stays for ~4.6s
  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'hidden';
    return () => { body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0d1021] via-[#17192b] to-[#23243a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ fontFamily: 'Fira Code, monospace' }}
    >
      {/* Overlays for extra depth */}
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3b1c5c33] to-transparent animate-pulse" />
      <div className="absolute left-1/4 top-1/4 w-2/5 h-2/5 rounded-full bg-blue-900/20 blur-3xl animate-pulse" />
      <div className="absolute right-1/4 bottom-1/4 w-1/3 h-1/3 rounded-full bg-purple-900/25 blur-2xl animate-pulse" />
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at 60% 30%, rgba(0,255,255,0.08) 0%, transparent 60%)'}} />
      {/* Glitchy robotic text */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white tracking-widest glitch-text drop-shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ fontFamily: 'Fira Code, monospace', letterSpacing: '0.08em' }}
        >
          <span className="zap-text">Mohammed Elshrief</span>
        </motion.h1>
        <motion.div
          key={step}
          className="text-lg md:text-2xl font-mono text-cyan-200 text-center min-h-[2.5em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.7 }}
        >
          {robotText[step]}
        </motion.div>
        <motion.div
          className="mt-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <span className="text-xs text-cyan-300/70 font-mono">
            Loading Portfolio
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
