
import React from "react";
import { motion } from "framer-motion";

interface TechIconProps {
  name: string;
  icon: string | React.ReactNode;
  color?: string;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ 
  name, 
  icon, 
  color = "bg-futuristic-purple/10",
  className = ""
}) => {
  return (
    <motion.div 
      className={`glass-effect p-4 rounded-xl flex items-center gap-3 transition-all group ${className}`}
      whileHover={{ 
        boxShadow: "0 0 25px rgba(155, 135, 245, 0.3)",
        borderColor: "rgba(155, 135, 245, 0.4)"
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className={`w-10 h-10 flex items-center justify-center ${color} rounded-lg text-xl transition-colors`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {typeof icon === "string" ? icon : icon}
      </motion.div>
      <span className="font-medium">{name}</span>
    </motion.div>
  );
};

export { TechIcon };
