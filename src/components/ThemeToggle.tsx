import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={"relative flex items-center w-[52px] h-[26px] rounded-full transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 " + (isDark ? "bg-stone-700 ring-1 ring-stone-600" : "bg-stone-200 ring-1 ring-stone-300")}
    >
      <motion.div
        className={"absolute flex items-center justify-center w-[20px] h-[20px] rounded-full shadow-md " + (isDark ? "bg-stone-200" : "bg-white")}
        animate={{ x: isDark ? 28 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon size={11} className="text-stone-700" strokeWidth={2} />
          ) : (
            <Sun size={11} className="text-amber-500" strokeWidth={2.5} />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
