import Navbar from '@/components/Navbar';
import ProjectsSection from '@/components/ProjectsSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <ProjectsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ProjectsPage;
