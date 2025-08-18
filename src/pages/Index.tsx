import EnhancedHeader from "@/components/EnhancedHeader";
import EnhancedHeroSection from "@/components/EnhancedHeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import EnhancedServicesSection from "@/components/EnhancedServicesSection";
import EnhancedPortfolioSection from "@/components/EnhancedPortfolioSection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader />
      <EnhancedHeroSection />
      <ProblemsSection />
      <EnhancedServicesSection />
      <EnhancedPortfolioSection />
      <ProcessSection />
      <Footer />
    </div>
  );
};

export default Index;
