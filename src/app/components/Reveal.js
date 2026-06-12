"use client";

import { motion, MotionConfig } from "framer-motion";

// Invariant: the rendered element must not depend on client-only media
// queries (SSR prerenders one branch; hydration won't patch the mismatch).
// MotionConfig reducedMotion="user" lets framer strip the transform for
// reduced-motion users while still resolving opacity to 1.
export default function Reveal({ children, delay = 0, className = "" }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
