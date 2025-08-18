import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  featured_image?: string;
  category_id?: string;
  status: 'draft' | 'published';
  tags: string[];
}

export const useBlogCRUD = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createArticle = async (data: BlogFormData) => {
    setLoading(true);
    try {
      const { data: article, error } = await supabase
        .from('blog_articles')
        .insert({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          meta_keywords: data.meta_keywords,
          featured_image: data.featured_image,
          category_id: data.category_id,
          status: data.status,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add tags if provided
      if (data.tags.length > 0 && article) {
        const tagPromises = data.tags.map(tag =>
          supabase.from('article_tags').insert({
            article_id: article.id,
            tag: tag.trim()
          })
        );
        await Promise.all(tagPromises);
      }

      toast({
        title: "Success",
        description: "Article created successfully",
      });

      return article;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create article",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = async (id: string, data: BlogFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_articles')
        .update({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          meta_title: data.meta_title,
          meta_description: data.meta_description,
          meta_keywords: data.meta_keywords,
          featured_image: data.featured_image,
          category_id: data.category_id,
          status: data.status,
          published_at: data.status === 'published' 
            ? new Date().toISOString() 
            : null,
        })
        .eq('id', id);

      if (error) throw error;

      // Update tags - remove old ones and add new ones
      await supabase.from('article_tags').delete().eq('article_id', id);
      
      if (data.tags.length > 0) {
        const tagPromises = data.tags.map(tag =>
          supabase.from('article_tags').insert({
            article_id: id,
            tag: tag.trim()
          })
        );
        await Promise.all(tagPromises);
      }

      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update article",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    setLoading(true);
    try {
      // Delete tags first due to foreign key constraints
      await supabase.from('article_tags').delete().eq('article_id', id);
      
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string, slug: string, description?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({ name, slug, description })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createArticle,
    updateArticle,
    deleteArticle,
    createCategory,
  };
};