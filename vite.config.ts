import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
  resolve: {
    alias: [
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },
    ],
  },
  publicDir: "public",
  base: "./",
  assetsInclude: ['**/*.svg'],
}));
