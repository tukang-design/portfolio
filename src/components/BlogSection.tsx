import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import LazyImage from './LazyImage';

interface BlogArticle {
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
  article_tags: Array<{ tag: string }>;
}

const BlogSection = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentArticles();
  }, []);

  const fetchRecentArticles = async () => {
    try {
      const { data, error } = await supabase
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
          ),
          article_tags (
            tag
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-6" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
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
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
            Latest Design Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest thoughts on design, case studies, and industry trends
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
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
                <CardDescription className="line-clamp-3">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(article.published_at)}
                  </div>
                  <Link 
                    to={`/blog/${article.slug}`}
                    className="text-sm font-semibold text-primary hover:text-primary-muted transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
                {article.article_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.article_tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded"
                      >
                        {tag.tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary-muted text-primary-foreground">
            <Link to="/blog" className="inline-flex items-center space-x-2">
              <span>View All Articles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;