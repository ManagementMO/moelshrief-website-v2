import Navbar from '@/components/Navbar';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main>
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ContactPage;
