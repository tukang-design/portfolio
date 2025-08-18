import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, Palette } from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";
import ContactFormModal from "./ContactFormModal";
import SuccessModal from "./SuccessModal";

const EnhancedServicesSection = () => {
  const {
    isContactFormOpen,
    isSuccessModalOpen,
    preSelectedService,
    contextData,
    openContactForm,
    closeContactForm,
    handleFormSuccess,
    closeSuccessModal,
    openNewInquiry,
    serviceContexts
  } = useContactForm();

  return (
    <>
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 animate-fade-in-up">
              Meet Your Tukang
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up animate-stagger-2">
              The Expert Craftsman for Your Brand.
            </p>
            <p className="text-lg text-muted-foreground mt-4 animate-fade-in-up animate-stagger-3">
              We offer two straightforward packages to get your business looking sharp and ready for customers. Cepat dan cun.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Brand Foundation Package */}
            <div className="bg-card rounded-2xl p-8 shadow-bold border border-border hover:shadow-xl transition-all duration-300 animate-fade-in-up animate-stagger-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Palette className="w-8 h-8 text-[hsl(var(--neon-green))]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Brand Foundation Package</h3>
                  <p className="text-muted-foreground">Perfect for new businesses or those needing a serious refresh. We build a brand that you can be proud of.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">Custom Logo Design Suite (multiple variations for all your needs)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">Professional Colour Palette</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">Strategic Typography Styles</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">Starter Brand Guideline</span>
                </div>
              </div>
              
              <Button 
                variant="cta" 
                size="lg" 
                className="w-full"
                onClick={() => openContactForm("Brand Foundation Package", serviceContexts.brandFoundation)}
              >
                Get My Brand
              </Button>
            </div>

            {/* Go-Live Website Package */}
            <div className="bg-card rounded-2xl p-8 shadow-bold border border-border hover:shadow-xl transition-all duration-300 animate-fade-in-up animate-stagger-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Globe className="w-8 h-8 text-[hsl(var(--neon-green))]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Go-Live Website Package</h3>
                  <p className="text-muted-foreground">Your 24/7 digital storefront. We create a professional, effective website designed to turn visitors into customers.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">1-Year Domain & Hosting Included</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">Up to 3 Custom-Designed Pages (e.g., Home, About, Services/Contact)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">Mobile-Responsive Layout (looks perfect on any device)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--neon-green))] mt-1 flex-shrink-0" />
                  <span className="text-foreground">Contact Form & WhatsApp Integration (get inquiries instantly)</span>
                </div>
              </div>
              
              <Button 
                variant="cta" 
                size="lg" 
                className="w-full"
                onClick={() => openContactForm("Go-Live Website Package", serviceContexts.website)}
              >
                Get My Website
              </Button>
            </div>
          </div>
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

export default EnhancedServicesSection;