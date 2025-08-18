import EnhancedHeader from "@/components/EnhancedHeader";
import EnhancedHeroSection from "@/components/EnhancedHeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import EnhancedServicesSection from "@/components/EnhancedServicesSection";
import EnhancedPortfolioSection from "@/components/EnhancedPortfolioSection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tukang Design",
    "description": "Professional brand design and website development services",
    "url": "https://tukangdesign.com",
    "logo": "https://tukangdesign.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [],
    "service": [
      {
        "@type": "Service",
        "name": "Brand Design",
        "description": "Complete brand identity design and strategy"
      },
      {
        "@type": "Service", 
        "name": "Website Development",
        "description": "Custom website development and design"
      }
    ]
  };

  return (
    <>
      <SEOHead 
        title="Tukang Design - Creative Service & Brand Design"
        description="Professional brand design and website development. Transform your business with powerful brand assets that work. 13 years experience."
        keywords="brand design, website development, logo design, branding agency, creative services, web design, business branding"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        <EnhancedHeader />
        <EnhancedHeroSection />
        <ProblemsSection />
        <EnhancedServicesSection />
        <EnhancedPortfolioSection />
        <ProcessSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
