import { Button } from "@/components/ui/button";
import { useContactForm } from "@/hooks/useContactForm";
import ContactFormModal from "./ContactFormModal";
import SuccessModal from "./SuccessModal";

const Footer = () => {
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

  return (
    <>
      <footer className="bg-background text-foreground py-16">
        <div className="container mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Tukang Design</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Professional brand design and website development. Transform your business with powerful brand assets that work. 13 years of big-league experience.
              </p>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Navigation</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="/" className="hover:text-[hsl(var(--neon-green))] transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-[hsl(var(--neon-green))] transition-colors">Services</a></li>
                <li><a href="#portfolio" className="hover:text-[hsl(var(--neon-green))] transition-colors">Portfolio</a></li>
                <li><a href="/blog" className="hover:text-[hsl(var(--neon-green))] transition-colors">Blog</a></li>
                <li><a href="#process" className="hover:text-[hsl(var(--neon-green))] transition-colors">Process</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>studio@tukang.design</li>
                <li>
                  <Button 
                    variant="cta" 
                    size="lg"
                    onClick={() => openContactForm()}
                    className="mt-2"
                  >
                    Get a Quote
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8">
            <div className="text-center text-muted-foreground text-sm">
              <p>© 2025 Tukang Design by TADAL STUDIO (202503200783). All Rights Reserved.</p>
            </div>
          </div>
        </div>

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
      </footer>
    </>
  );
};

export default Footer;