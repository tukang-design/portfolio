import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { useBlogCRUD, type BlogFormData } from '@/hooks/useBlogCRUD';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from './RichTextEditor';

interface BlogFormProps {
  articleId?: string;
  onSuccess?: () => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const BlogForm = ({ articleId, onSuccess }: BlogFormProps) => {
  const navigate = useNavigate();
  const { loading, createArticle, updateArticle } = useBlogCRUD();
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    featured_image: '',
    category_id: '',
    status: 'draft',
    tags: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (articleId) {
      fetchArticle();
      setIsEditing(true);
    }
  }, [articleId]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticle = async () => {
    if (!articleId) return;

    try {
      const { data: article, error } = await supabase
        .from('blog_articles')
        .select(`
          *,
          article_tags (tag)
        `)
        .eq('id', articleId)
        .single();

      if (error) throw error;

      if (article) {
        setFormData({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || '',
          content: article.content,
          meta_title: article.meta_title || '',
          meta_description: article.meta_description || '',
          meta_keywords: article.meta_keywords || '',
          featured_image: article.featured_image || '',
          category_id: article.category_id || '',
          status: (article.status as 'draft' | 'published') || 'draft',
          tags: article.article_tags?.map((t: any) => t.tag) || [],
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    const dataToSubmit = { ...formData, status };
    
    try {
      if (isEditing && articleId) {
        await updateArticle(articleId, dataToSubmit);
      } else {
        await createArticle(dataToSubmit);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/blog');
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/blog')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                {isEditing ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update your article content' : 'Write and publish a new blog article'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit('draft')}
              disabled={loading || !formData.title || !formData.content}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </Button>
            <Button 
              onClick={() => handleSubmit('published')}
              disabled={loading || !formData.title || !formData.content}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Publish</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>The main content of your blog article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter article title..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-url-slug"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the article..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <div className="mt-1">
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      placeholder="Write your article content here..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>

                <Separator />

                <div>
                  <Label>Tags</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your article for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO title (60 chars max)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description (160 chars max)"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;