import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";
import ContactFormModal from "./ContactFormModal";
import SuccessModal from "./SuccessModal";
import SearchModal from "./SearchModal";

const EnhancedHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // ESC to close search
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="font-heading font-bold text-xl text-white">Tukang Design</div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-foreground hover:text-[hsl(var(--neon-green))] transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-foreground hover:text-[hsl(var(--neon-green))] transition-colors font-medium"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('work')}
                className="text-foreground hover:text-[hsl(var(--neon-green))] transition-colors font-medium"
              >
                Our Work
              </button>
              <a 
                href="/blog"
                className="text-foreground hover:text-[hsl(var(--neon-green))] transition-colors font-medium"
              >
                Blog
              </a>
              <button 
                onClick={() => scrollToSection('process')}
                className="text-foreground hover:text-[hsl(var(--neon-green))] transition-colors font-medium"
              >
                Process
              </button>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-foreground hover:text-[hsl(var(--neon-green))] transition-colors font-medium flex items-center space-x-1"
                aria-label="Search (Ctrl+K)"
                title="Search (Ctrl+K)"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline text-xs text-muted-foreground">⌘K</span>
              </button>
            </nav>

            {/* CTA Button */}
            <Button 
              variant="cta" 
              size="lg"
              onClick={() => openContactForm()}
            >
              Get a Free Quote
            </Button>
          </div>
        </div>
      </header>

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

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default EnhancedHeader;