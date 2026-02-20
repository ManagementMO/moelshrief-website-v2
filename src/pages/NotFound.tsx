import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <CursorGlow />
      <Navbar />
      <main className="section-container py-24 md:py-32">
        <p className="section-heading mb-4">404</p>
        <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-3 tracking-tight">
          page not found.
        </h1>
        <p className="text-stone-500 font-light text-[15px] leading-relaxed mb-8">
          the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors group"
        >
          back to home
          <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
