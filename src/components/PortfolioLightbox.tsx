import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string;
  images: string[];
  services: string[];
  timeline: string | null;
  client: string | null;
}

interface PortfolioLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
}

const PortfolioLightbox = ({ isOpen, onClose, item }: PortfolioLightboxProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when item changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [item]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!item || !isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="h-full w-full overflow-hidden">
        {/* Header with close button */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
              {item.category}
            </span>
            {item.client && (
              <span className="text-sm text-white/70">{item.client}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Main content layout */}
        <div className="h-full grid lg:grid-cols-2">
          {/* Image section */}
          <div className="relative flex flex-col h-full">
            {/* Main image display */}
            <div className="flex-1 relative bg-black/50">
              <img
                src={item.images[currentImageIndex]}
                alt={`${item.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Navigation arrows */}
              {item.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {item.images.length}
              </div>
            </div>

            {/* Thumbnail navigation */}
            {item.images.length > 1 && (
              <div className="p-4 bg-black/30 backdrop-blur-sm">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-white scale-105' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="bg-background h-full overflow-y-auto">
            <div className="p-8 lg:p-12 space-y-8">
              {/* Project header */}
              <div className="space-y-4">
                <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary leading-tight">
                  {item.title}
                </h1>
                <p className="text-xl text-primary/80 font-medium leading-relaxed">
                  {item.description}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.details}
                </p>
              </div>

              {/* Services and timeline grid */}
              <div className="grid gap-8 lg:gap-12">
                {/* Services */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary">Services Provided</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {item.services.map((service, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-accent/30">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                {item.timeline && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-primary">Project Timeline</h3>
                    <p className="text-muted-foreground text-lg bg-accent/20 p-4 rounded-lg">
                      {item.timeline}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-4">
                  <Button variant="default" size="lg" className="w-full lg:w-auto text-lg px-8 py-4">
                    <ExternalLink className="w-5 h-5 mr-3" />
                    View Full Case Study
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioLightbox;