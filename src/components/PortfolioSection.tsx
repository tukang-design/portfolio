import portfolioKapitani from "@/assets/portfolio-kapitani.jpg";
import portfolioSag from "@/assets/portfolio-sag-logistics.jpg";
import portfolioYouthopia from "@/assets/portfolio-youthopia.jpg";
import portfolioRaisuri from "@/assets/portfolio-raisuri.jpg";
import { ExternalLink } from "lucide-react";

const PortfolioSection = () => {
  const portfolioItems = [
    {
      id: 1,
      title: "Kapitani",
      category: "Logo Design & Brand Guide",
      description: "App Redesign & Design System",
      details: "Their app interface was getting cluttered. We gave it a total user experience overhaul, making it clean, simple, and intuitive for customers to use.",
      image: portfolioKapitani,
      link: "#"
    },
    {
      id: 2,
      title: "SAG Logistics Sdn Bhd",
      category: "Rebranding & Web Development",
      description: "Corporate Brand Transformation",
      details: "Their outdated image didn't match their global-level service. We delivered a sharp corporate rebrand and a new website to build instant trust with B2B clients.",
      image: portfolioSag,
      link: "#"
    },
    {
      id: 3,
      title: "Youthopia",
      category: "Brand Identity Design",
      description: "Vibrant Youth-Focused Brand",
      details: "To connect with a younger crowd, they needed a vibrant look. We crafted a fresh logo and a solid brand identity that truly clicks with their target audience.",
      image: portfolioYouthopia,
      link: "#"
    },
    {
      id: 4,
      title: "Raisuri Football Academy",
      category: "Brand Revamp & Jersey Design",
      description: "Sports Brand & Jersey Design",
      details: "We delivered a powerful brand revamp and a custom jersey design to give the academy a professional look to wear with pride.",
      image: portfolioRaisuri,
      link: "#"
    }
  ];

  return (
    <section id="work" className="py-20 bg-section-bg">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
            From brand new logos to full-scale websites, here's a look at our craftsmanship.
          </h2>
        </div>

        {/* Portfolio Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {portfolioItems.map((item) => (
            <div key={item.id} className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-bold transition-all duration-300 border border-border/50">
              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-primary">#{item.id}</span>
                  <span className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-lg font-semibold text-primary mb-3">{item.description}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">{item.details}</p>
                
                <a 
                  href={item.link}
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-muted font-semibold transition-colors group"
                >
                  <span>Read case study</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;