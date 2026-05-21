# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `npm run dev` - Start development server on localhost:8080
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build locally

### Test Commands
This project does not currently have test scripts configured.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom cyber/futuristic theme
- **3D Graphics**: Three.js with React Three Fiber and Drei
- **Animation**: Framer Motion
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router DOM v7
- **State Management**: Tanstack Query for server state
- **Analytics**: Vercel Analytics and Speed Insights

### Project Structure
- `src/components/` - React components organized by feature
  - `ui/` - Reusable UI components (shadcn/ui based)
  - `three/` - Three.js 3D components
- `src/pages/` - Route components
- `src/providers/` - Context providers (theme management)
- `src/hooks/` - Custom React hooks
- `src/config/` - Configuration files (environment setup)
- `src/lib/` - Utility functions
- `public/` - Static assets including icons, images, and favicons

### Key Features
- Personal portfolio website with cyberpunk/futuristic design
- 3D interactive elements using Three.js
- Weather integration components
- Dark theme only (no light mode toggle)
- Responsive design with mobile support
- SEO optimization with structured data

### Build Configuration
- **Vite Config**: Custom alias `@/` points to `src/`
- **Path Resolution**: Absolute imports using `@/` prefix
- **Server**: Development server runs on port 8080
- **Deployment**: Configured for Netlify (see netlify.toml)

### Environment Variables
- `VITE_WEATHER_API_KEY` - Weather API key for weather components
- Environment variables must be prefixed with `VITE_` to be accessible

### Code Conventions
- TypeScript strict mode enabled
- ESLint with React hooks and TypeScript rules
- Tailwind utility-first CSS approach
- Custom color palette using cyber/futuristic colors
- Component-based architecture with clear separation of concerns
- Lazy loading for performance optimization (e.g., CyberneticCursor)

### Notable Technical Details
- Custom Tailwind theme with cyber colors and animations
- Three.js optimization with specific dependencies included in Vite
- React Router with catch-all route for 404 handling
- Loading screen with 3.5s timeout
- Scroll reveal animations with custom implementation
- Theme provider locked to dark mode only