import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Eye } from 'lucide-react';
import LazyImage from './LazyImage';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  view_count: number;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

interface RelatedArticlesProps {
  currentArticleId: string;
  categorySlug?: string;
  tags?: string[];
  limit?: number;
}

const RelatedArticles = ({ 
  currentArticleId, 
  categorySlug, 
  tags = [], 
  limit = 3 
}: RelatedArticlesProps) => {
  const [articles, setArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedArticles();
  }, [currentArticleId, categorySlug, tags]);

  const fetchRelatedArticles = async () => {
    try {
      let query = supabase
        .from('blog_articles')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          published_at,
          view_count,
          blog_categories (
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .neq('id', currentArticleId)
        .order('published_at', { ascending: false })
        .limit(limit);

      // Try to find articles in the same category first
      if (categorySlug) {
        const { data: categoryData, error } = await supabase
          .from('blog_categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (!error && categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // If we don't have enough articles from the same category, get more recent ones
      if (data && data.length < limit) {
        const additionalQuery = supabase
          .from('blog_articles')
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            published_at,
            view_count,
            blog_categories (
              name,
              slug
            )
          `)
          .eq('status', 'published')
          .neq('id', currentArticleId)
          .order('published_at', { ascending: false })
          .limit(limit - data.length);

        if (categorySlug) {
          const { data: categoryData } = await supabase
            .from('blog_categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();

          if (categoryData) {
            additionalQuery.neq('category_id', categoryData.id);
          }
        }

        const { data: additionalData } = await additionalQuery;
        
        setArticles([...data, ...(additionalData || [])]);
      } else {
        setArticles(data || []);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="mt-16 pt-8 border-t border-border">
        <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
            {article.featured_image && (
              <div className="relative overflow-hidden">
                <LazyImage
                  src={article.featured_image}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                {article.blog_categories && (
                  <Badge variant="secondary" className="text-xs">
                    {article.blog_categories.name}
                  </Badge>
                )}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Eye className="h-3 w-3 mr-1" />
                  {article.view_count}
                </div>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                <Link to={`/blog/${article.slug}`}>
                  {article.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(article.published_at)}
                </div>
                <Link 
                  to={`/blog/${article.slug}`}
                  className="text-xs font-semibold text-primary hover:text-primary-muted transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;