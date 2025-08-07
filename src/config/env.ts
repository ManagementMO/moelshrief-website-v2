// Environment configuration
// For production, use environment variables or a secure method to store API keys

// In Vite, environment variables are exposed on import.meta.env and must be prefixed with VITE_
// Ensure you have a .env file with VITE_WEATHER_API_KEY set (see .env.example)
const WEATHER_API_KEY = (import.meta as any)?.env?.VITE_WEATHER_API_KEY ?? "";

export const ENV = {
  WEATHER_API_KEY,
};

export default ENV;
