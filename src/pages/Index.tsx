import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';

const Index = () => {
  return (
    <div className="min-h-screen">
      <CursorGlow />
      <Navbar />
      <main>
        <AboutSection />
        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
