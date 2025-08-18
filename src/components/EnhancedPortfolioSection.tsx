import { useState } from "react";
import { ExternalLink } from "lucide-react";
import portfolioKapitani from "@/assets/portfolio-kapitani.jpg";
import portfolioSag from "@/assets/portfolio-sag-logistics.jpg";
import portfolioYouthopia from "@/assets/portfolio-youthopia.jpg";
import portfolioRaisuri from "@/assets/portfolio-raisuri.jpg";
import PortfolioLightbox from "./PortfolioLightbox";

const EnhancedPortfolioSection = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Extended portfolio data with multiple images and detailed information
  const portfolioItems = [
    {
      id: 1,
      title: "Kapitani",
      category: "Logo Design & Brand Guide",
      description: "App Redesign & Design System",
      details: "Their app interface was getting cluttered. We gave it a total user experience overhaul, making it clean, simple, and intuitive for customers to use. The new design system ensures consistency across all touchpoints while improving user engagement by 40%.",
      image: portfolioKapitani,
      images: [portfolioKapitani, portfolioKapitani, portfolioKapitani, portfolioKapitani],
      services: [
        "User Interface Design",
        "Design System Creation", 
        "User Experience Research",
        "App Prototyping",
        "Brand Guidelines",
        "Icon Design"
      ],
      timeline: "3 months - Research, Design, Testing & Implementation",
      client: "Tech Startup",
      link: "#"
    },
    {
      id: 2,
      title: "SAG Logistics Sdn Bhd",
      category: "Rebranding & Web Development",
      description: "Corporate Brand Transformation",
      details: "Their outdated image didn't match their global-level service. We delivered a sharp corporate rebrand and a new website to build instant trust with B2B clients. The result was a 60% increase in qualified leads within 6 months.",
      image: portfolioSag,
      images: [portfolioSag, portfolioSag, portfolioSag, portfolioSag],
      services: [
        "Logo Redesign",
        "Corporate Identity",
        "Website Development",
        "Business Card Design",
        "Letterhead Design",
        "Vehicle Branding"
      ],
      timeline: "4 months - Strategy, Design, Development & Launch",
      client: "Logistics Company",
      link: "#"
    },
    {
      id: 3,
      title: "Youthopia",
      category: "Brand Identity Design",
      description: "Vibrant Youth-Focused Brand",
      details: "To connect with a younger crowd, they needed a vibrant look. We crafted a fresh logo and a solid brand identity that truly clicks with their target audience. Social media engagement increased by 150% post-rebrand.",
      image: portfolioYouthopia,
      images: [portfolioYouthopia, portfolioYouthopia, portfolioYouthopia, portfolioYouthopia],
      services: [
        "Logo Design",
        "Brand Identity",
        "Social Media Kit",
        "Merchandise Design",
        "Color Palette",
        "Typography System"
      ],
      timeline: "2 months - Concept, Design & Brand Guidelines",
      client: "Youth Organization",
      link: "#"
    },
    {
      id: 4,
      title: "Raisuri Football Academy",
      category: "Brand Revamp & Jersey Design",
      description: "Sports Brand & Jersey Design",
      details: "We delivered a powerful brand revamp and a custom jersey design to give the academy a professional look to wear with pride. The new brand helped attract 40% more student athletes.",
      image: portfolioRaisuri,
      images: [portfolioRaisuri, portfolioRaisuri, portfolioRaisuri, portfolioRaisuri],
      services: [
        "Sports Logo Design",
        "Jersey Design",
        "Team Uniform Kit",
        "Badge Design",
        "Social Media Assets",
        "Promotional Materials"
      ],
      timeline: "6 weeks - Design, Production & Team Launch",
      client: "Football Academy",
      link: "#"
    }
  ];

  const openLightbox = (item: any) => {
    setSelectedPortfolio(item);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedPortfolio(null);
  };

  return (
    <>
      <section id="work" className="py-20 bg-section-bg">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              From brand new logos to full-scale websites, here's a look at our craftsmanship.
            </h2>
          </div>

          {/* Portfolio Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {portfolioItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-bold transition-all duration-500 border border-border/50 cursor-pointer animate-fade-in-up animate-stagger-${Math.min(index + 1, 4)}`}
                onClick={() => openLightbox(item)}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-background/90 px-4 py-2 rounded-full text-[hsl(var(--neon-green))] font-semibold transition-colors duration-500">
                      View Project Details
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center justify-end mb-4">
                    <span className="text-xs text-white bg-[hsl(var(--neon-green-muted))] px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-lg font-semibold text-white mb-3">{item.description}</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">{item.details}</p>
                  
                  <div 
                    className="inline-flex items-center space-x-2 text-[hsl(var(--neon-green))] hover:text-[hsl(var(--neon-green))]/80 font-semibold transition-colors group"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(item);
                    }}
                  >
                    <span>View full project</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PortfolioLightbox 
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        item={selectedPortfolio}
      />
    </>
  );
};

export default EnhancedPortfolioSection;