import Navbar from '@/components/Navbar';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <CursorGlow />
      <Navbar />
      <main>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
