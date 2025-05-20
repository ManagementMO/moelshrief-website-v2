import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { motion } from "framer-motion";
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);
  // Scroll reveal functionality
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-sequential');

    const reveal = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', reveal);
    reveal();

    return () => window.removeEventListener('scroll', reveal);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className={`relative min-h-screen bg-black text-white overflow-hidden transition-colors duration-300 ${loading ? 'pointer-events-none select-none' : ''}`} style={{ opacity: loading ? 0.5 : 1 }}>
        {/* Enhanced background elements */}
        <div className="fixed inset-0 z-0 opacity-70 pointer-events-none bg-gradient-radial from-gray-900/50 via-black to-black"></div>
        {/* Noise texture overlay with reduced opacity */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-3"></div>
        {/* Main content */}
        <div className="relative z-10">
          <Navbar />
          <main>
            <AboutSection />
            <SkillsMarquee />
            <ProjectsSection />
            <ContactSection />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </div>
    </>
  );
};

export default Index;
