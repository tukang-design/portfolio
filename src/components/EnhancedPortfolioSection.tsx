import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PortfolioLightbox from "./PortfolioLightbox";
import LazyImage from "./LazyImage";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string;
  services: string[];
  timeline: string | null;
  client: string | null;
  images: string[];
  portfolio_images: Array<{
    image_url: string;
    is_main: boolean;
  }>;
}

const EnhancedPortfolioSection = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select(`
            *,
            portfolio_images (
              image_url,
              is_main,
              sort_order
            )
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match expected format
        const transformedData = data?.map(item => ({
          ...item,
          services: Array.isArray(item.services) ? item.services.map(s => String(s)) : [],
          images: item.portfolio_images?.map((img: any) => img.image_url) || [],
          portfolio_images: item.portfolio_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
        })) || [];

        setPortfolioItems(transformedData);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const openLightbox = (item: PortfolioItem) => {
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
            {loading ? (
              // Loading skeletons
              [...Array(4)].map((_, index) => (
                <div key={index} className="group bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50">
                  <Skeleton className="w-full h-64" />
                  <div className="p-8">
                    <div className="flex items-center justify-end mb-4">
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-3" />
                    <Skeleton className="h-16 w-full mb-6" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              ))
            ) : portfolioItems.map((item, index) => {
              const mainImage = item.portfolio_images?.find(img => img.is_main) || item.portfolio_images?.[0];
              return (
              <div 
                key={item.id} 
                className={`group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-bold transition-all duration-500 border border-border/50 cursor-pointer animate-fade-in-up animate-stagger-${Math.min(index + 1, 4)}`}
                onClick={() => openLightbox(item)}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  {mainImage ? (
                    <LazyImage
                      src={mainImage.image_url} 
                      alt={item.title}
                      width={600}
                      height={256}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-64 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image available</span>
                    </div>
                  )}
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
            );
            })}
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