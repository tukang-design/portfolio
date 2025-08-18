import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, FileText, Briefcase, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  excerpt?: string;
  type: 'blog' | 'portfolio';
  slug: string;
  category?: string;
  url: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      await performSearch(query);
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      const searchTerm = `%${searchQuery}%`;

      // Search blog articles
      const { data: blogResults } = await supabase
        .from('blog_articles')
        .select('id, title, excerpt, slug')
        .eq('status', 'published')
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

      // Search portfolios
      const { data: portfolioResults } = await supabase
        .from('portfolios')
        .select('id, title, description, slug, category')
        .eq('status', 'published')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},details.ilike.${searchTerm}`)
        .limit(5);

      const combinedResults: SearchResult[] = [
        ...(blogResults || []).map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          type: 'blog' as const,
          slug: item.slug,
          url: `/blog/${item.slug}`
        })),
        ...(portfolioResults || []).map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.description,
          type: 'portfolio' as const,
          slug: item.slug,
          category: item.category,
          url: `/#portfolio-${item.id}` // Link to portfolio section with item
        }))
      ];

      setResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'blog') {
      window.location.href = result.url;
    } else {
      // For portfolio items, scroll to portfolio section and potentially highlight item
      onClose();
      const portfolioSection = document.getElementById('work');
      portfolioSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search blog articles, portfolio projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-lg"
            autoFocus
          />

          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3">
                    <Skeleton className="h-4 w-4 mt-1" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && results.length === 0 && query && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            )}

            {!loading && results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  "hover:bg-accent focus:bg-accent focus:outline-none",
                  "group"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {result.type === 'blog' ? (
                      <FileText className="h-4 w-4 text-primary" />
                    ) : (
                      <Briefcase className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                        {result.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {result.type}
                      </Badge>
                      {result.category && (
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                      )}
                    </div>
                    
                    {result.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.excerpt}
                      </p>
                    )}
                  </div>
                  
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>

          {query && (
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              Press ESC to close • Enter to open first result
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;