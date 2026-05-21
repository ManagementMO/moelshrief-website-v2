
// Type definitions for UI component fixes

// Fix for FuturisticButton component
interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  glowEffect?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
}

// Fix for BadgeProps interface
interface BadgeProps {
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
  children?: React.ReactNode;
}
