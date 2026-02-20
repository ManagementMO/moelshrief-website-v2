import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main>
        <AboutSection />
        <SkillsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AboutPage;
