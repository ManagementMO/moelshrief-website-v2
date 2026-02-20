import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import SkillsSection from '@/components/SkillsSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AboutPage;
