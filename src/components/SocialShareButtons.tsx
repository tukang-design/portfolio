import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const SocialShareButtons = ({ url, title, description, className }: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      
      {/* Native Share (mobile) */}
      <Button
        variant="outline"
        size="sm"
        onClick={nativeShare}
        className="md:hidden"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      {/* Social Share Buttons (desktop) */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareData.twitter, '_blank')}
          className="hover:bg-blue-50 hover:border-blue-200"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareData.linkedin, '_blank')}
          className="hover:bg-blue-50 hover:border-blue-200"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareData.facebook, '_blank')}
          className="hover:bg-blue-50 hover:border-blue-200"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="hover:bg-accent"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Link className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialShareButtons;