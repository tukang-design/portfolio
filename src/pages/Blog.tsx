import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

const Blog = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
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
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('name, slug')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.blog_categories?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-subtle border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6">
              Design Insights & Stories
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our latest thoughts on design, case studies, and industry trends
            </p>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
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
            ) : filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                    {article.featured_image && (
                      <div className="relative overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={article.title}
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
                          {article.article_tags.slice(0, 3).map((tag, index) => (
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
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No articles found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory
                    ? "Try adjusting your search or filter criteria."
                    : "Check back soon for new content!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;