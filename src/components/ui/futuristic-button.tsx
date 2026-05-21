
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface FuturisticButtonProps {
  // Define only the props we need
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glowEffect?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;

}

const FuturisticButton = ({
  children,
  variant = "primary",
  size = "md",
  glowEffect = false,
  className,
  ...props
}: FuturisticButtonProps) => {
  const baseStyles = "relative font-medium rounded-md flex items-center justify-center transition-all duration-300 ease-in-out overflow-hidden group";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/80 hover:to-primary",
    secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/80 hover:to-secondary",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
  };
  
  const sizeStyles = {
    sm: "text-sm h-8 px-3",
    md: "text-base h-10 px-4",
    lg: "text-lg h-12 px-6",
  };
  
  // Advanced RTX glow effect
  const glowStyles = glowEffect 
    ? "before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-primary/30 before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" 
    : "";

  return (
    <motion.button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        glowStyles,
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {/* Reflective highlight effect */}
      <span className="absolute inset-0 w-full h-full overflow-hidden rounded-md">
        <motion.span 
          className="absolute top-0 left-0 right-0 h-[1px] bg-white/20 transform -translate-y-full" 
          whileHover={{ translateY: 0 }}
          transition={{ duration: 0.7 }}
        ></motion.span>
        <motion.span 
          className="absolute -top-full -left-1/4 w-[200%] h-[200%] rounded-full bg-white/5 blur-md"
          whileHover={{ top: "-20%" }}
          transition={{ duration: 0.7 }}
        ></motion.span>
      </span>
      
      {/* Button content with subtle shadow */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Interactive ripple effect */}
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <motion.span 
          className="absolute top-1/2 left-1/2 w-0 h-0 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          whileTap={{ 
            width: "300%", 
            height: "300%", 
            opacity: 0
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        ></motion.span>
      </span>
    </motion.button>
  );
};

export { FuturisticButton };
