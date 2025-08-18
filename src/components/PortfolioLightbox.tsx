import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  details: string;
  images: string[];
  services: string[];
  timeline: string;
  client: string;
}

interface PortfolioLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
}

const PortfolioLightbox = ({ isOpen, onClose, item }: PortfolioLightboxProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!item) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <div className="relative">

          {/* Image Carousel */}
          <div className="relative h-96 bg-black overflow-hidden">
            <img
              src={item.images[currentImageIndex]}
              alt={`${item.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
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

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {item.images.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {item.images.length > 1 && (
            <div className="flex space-x-2 p-4 bg-background overflow-x-auto">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary' : 'border-border'
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
          )}

          {/* Project Details */}
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-sm text-muted-foreground">{item.client}</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-primary mb-2">{item.title}</h2>
              <p className="text-lg font-semibold text-primary-muted mb-4">{item.description}</p>
              <p className="text-muted-foreground leading-relaxed">{item.details}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-primary mb-3">Services Provided</h3>
                <ul className="space-y-2">
                  {item.services.map((service, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-3">Project Timeline</h3>
                <p className="text-muted-foreground mb-6">{item.timeline}</p>

                <Button variant="cta" size="lg" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Case Study
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioLightbox;