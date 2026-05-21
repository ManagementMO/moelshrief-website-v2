import { motion } from 'framer-motion';

const NavSignature = () => {
  return (
    <svg
      viewBox="0 0 68 42"
      width="56"
      height="35"
      fill="none"
      aria-label="ME"
      className="overflow-visible"
    >
      <motion.path
        d={`
          M 2,30
          C 3,30 3,10 11,10
          C 19,10 19,30 19,30
          C 19,30 19,10 27,10
          C 35,10 35,30 35,30
          C 37,30 40,22 42,20
          C 42,12 47,9 52,13
          C 57,17 56,27 50,30
          C 44,33 38,26 41,20
          L 58,20
        `}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 2.2, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
          opacity: { duration: 0.01, delay: 0.1 },
        }}
      />
    </svg>
  );
};

export default NavSignature;
