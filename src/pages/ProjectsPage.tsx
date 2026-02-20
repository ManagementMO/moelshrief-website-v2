import Navbar from '@/components/Navbar';
import ProjectsSection from '@/components/ProjectsSection';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen">
      <CursorGlow />
      <Navbar />
      <main>
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
