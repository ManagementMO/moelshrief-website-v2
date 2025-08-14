
import { createContext, useContext } from 'react';

export interface ThemeContextType {
  primaryHue: number;
  primarySaturation: number;
  primaryLightness: number;
  secondaryHue: number;
  secondarySaturation: number;
  secondaryLightness: number;
  accentHue: number;
  accentSaturation: number;
  accentLightness: number;
  backgroundHue: number;
  backgroundSaturation: number;
  backgroundLightness: number;
  mode?: 'dark' | 'light';
  toggleTheme?: () => void;
}

// Default cyberpunk theme values (dark mode)
const defaultTheme: ThemeContextType = {
  // Neon magenta
  primaryHue: 268,
  primarySaturation: 92,
  primaryLightness: 67,
  
  // Neon cyan
  secondaryHue: 195,
  secondarySaturation: 92,
  secondaryLightness: 67,
  
  // Neon yellow
  accentHue: 52,
  accentSaturation: 92,
  accentLightness: 67,
  
  // Dark blue-black
  backgroundHue: 225,
  backgroundSaturation: 70,
  backgroundLightness: 3,
  
  mode: 'dark',
  toggleTheme: () => {}
};

export const ThemeContext = createContext<ThemeContextType>(defaultTheme);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default useTheme;
