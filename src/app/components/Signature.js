"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RotateCcw } from "lucide-react";

const TEXT = "mohammed elshrief";

export default function Signature() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-end gap-2" key={key}>
      <div className="relative inline-block overflow-hidden">
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-handwriting text-4xl sm:text-5xl leading-none text-stone-700 dark:text-stone-400 px-1 whitespace-nowrap"
        >
          {TEXT}
        </motion.div>
        <motion.svg
          width="100%"
          height="10"
          viewBox="0 0 320 10"
          preserveAspectRatio="none"
          className="absolute left-0 -bottom-1 w-full text-amber-500/70 dark:text-amber-400/60"
        >
          <motion.path
            d="M 4 6 C 80 3, 180 8, 316 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.9, ease: "easeOut", delay: 2.3 },
              opacity: { duration: 0.2, delay: 2.3 },
            }}
          />
        </motion.svg>
      </div>
      <motion.button
        onClick={() => setKey((k) => k + 1)}
        aria-label="Replay signature animation"
        className="text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 3.2 }}
      >
        <RotateCcw size={14} />
      </motion.button>
    </div>
  );
}
