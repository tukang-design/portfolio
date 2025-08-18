import { Button } from "@/components/ui/button";
import { useContactForm } from "@/hooks/useContactForm";
import ContactFormModal from "./ContactFormModal";
import SuccessModal from "./SuccessModal";

const EnhancedHeroSection = () => {
  const {
    isContactFormOpen,
    isSuccessModalOpen,
    preSelectedService,
    contextData,
    openContactForm,
    closeContactForm,
    handleFormSuccess,
    closeSuccessModal,
    openNewInquiry
  } = useContactForm();

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="home" className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-background via-primary-light to-accent overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary))_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headlines */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary mb-6 leading-tight animate-fade-in-up">
              Brand Nampak Lesu?<br />
              <span className="text-primary-muted">Website Tak Bawa Sales?</span>
            </h1>
            
            {/* Sub-text */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-stagger-2">
              At <strong className="text-primary">Tukang Design</strong>, we don't just create pretty designs. We build powerful brand assets that work. 
              With <strong>13 years of big-league experience</strong>, we deliver high-quality design, cepat dan berbaloi.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-stagger-3">
              <Button 
                variant="hero" 
                size="xl"
                onClick={scrollToWork}
              >
                View Our Work
              </Button>
              <Button 
                variant="cta" 
                size="xl"
                onClick={() => openContactForm()}
              >
                Get Free Quote & Consultation
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-background" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V120H1200V0C1200,0,1050,120,600,120S0,0,0,0Z" />
          </svg>
        </div>
      </section>

      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={closeContactForm}
        onSuccess={handleFormSuccess}
        preSelectedService={preSelectedService}
        contextData={contextData}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        onNewInquiry={openNewInquiry}
      />
    </>
  );
};

export default EnhancedHeroSection;