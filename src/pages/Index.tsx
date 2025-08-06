import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CodeExecutionPreview from '@/components/CodeExecutionPreview';
import DSATopicsPreview from '@/components/DSATopicsPreview';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CodeExecutionPreview />
        <DSATopicsPreview />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
