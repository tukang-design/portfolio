import { useState, useCallback } from 'react';

interface UseImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
}

export const useImageOptimization = () => {
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const optimizeImageUrl = useCallback((
    originalUrl: string, 
    options: UseImageOptimizationOptions = {}
  ): string => {
    if (!originalUrl) return originalUrl;

    // For Supabase storage URLs, we can add transformation parameters
    if (originalUrl.includes('supabase')) {
      const url = new URL(originalUrl);
      const { quality = 80, format, width, height } = options;
      
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      if (quality !== 80) url.searchParams.set('quality', quality.toString());
      if (format) url.searchParams.set('format', format);
      
      return url.toString();
    }

    return originalUrl;
  }, []);

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const handleImageLoad = useCallback((src: string) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(src);
      return newSet;
    });
  }, []);

  const handleImageLoadStart = useCallback((src: string) => {
    setLoadingImages(prev => new Set(prev).add(src));
  }, []);

  return {
    optimizeImageUrl,
    preloadImage,
    handleImageLoad,
    handleImageLoadStart,
    isImageLoading: (src: string) => loadingImages.has(src)
  };
};