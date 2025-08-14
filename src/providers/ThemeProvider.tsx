import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeContextType, ThemeContext } from '@/hooks/use-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Set to dark mode only
  const [mode, setMode] = useState<'dark'>('dark');
  
  // Define theme values for dark mode with RTX-style colors
  const themes = {
    dark: {
      // Primary - RTX Cyan
      primaryHue: 180,
      primarySaturation: 100,
      primaryLightness: 50,
      
      // Secondary - Electric Blue
      secondaryHue: 210,
      secondarySaturation: 100,
      secondaryLightness: 50,
      
      // Accent - Holographic Purple
      accentHue: 270,
      accentSaturation: 100,
      accentLightness: 60,
      
      // Background - Deep Space Black
      backgroundHue: 225,
      backgroundSaturation: 70,
      backgroundLightness: 3,
      
      // Surface - Dark Glass
      surfaceHue: 225,
      surfaceSaturation: 20,
      surfaceLightness: 10,
      
      // Border - Subtle Glow
      borderHue: 210,
      borderSaturation: 30,
      borderLightness: 20,
      
      // Text - Pure White
      textHue: 0,
      textSaturation: 0,
      textLightness: 100,
      
      // Muted - Soft Gray
      mutedHue: 220,
      mutedSaturation: 10,
      mutedLightness: 40,
      
      // Success - Neon Green
      successHue: 120,
      successSaturation: 100,
      successLightness: 50,
      
      // Warning - Amber Glow
      warningHue: 45,
      warningSaturation: 100,
      warningLightness: 50,
      
      // Error - Neon Red
      errorHue: 0,
      errorSaturation: 100,
      errorLightness: 50,
    }
  };
  
  // Set theme in body class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add('dark');
  }, []);
  
  // Create the theme context value
  const theme: ThemeContextType = {
    ...themes.dark,
    mode: 'dark',
    toggleTheme: () => {} // Disable theme toggle
  };
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
