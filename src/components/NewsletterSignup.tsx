import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterSignupProps {
  variant?: 'card' | 'inline' | 'footer';
  className?: string;
}

const NewsletterSignup = ({ variant = 'card', className }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Store newsletter subscription in contact_inquiries table
      const { error } = await supabase
        .from('contact_inquiries')
        .insert({
          email,
          name: 'Newsletter Subscriber',
          message: 'Newsletter subscription',
          source: 'newsletter',
          status: 'new'
        });

      if (error) throw error;

      setIsSubscribed(true);
      setEmail('');
      
      toast({
        title: "Welcome aboard! 🎉",
        description: "You've been subscribed to our newsletter.",
      });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h4 className="text-lg font-semibold mb-4 text-white">Stay Updated</h4>
        <p className="text-muted-foreground mb-4 text-sm">
          Get the latest design insights and project updates delivered to your inbox.
        </p>
        {isSubscribed ? (
          <div className="flex items-center space-x-2 text-green-400">
            <Check className="h-4 w-4" />
            <span className="text-sm">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/10 border-border/50 text-white placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-primary hover:bg-primary-muted"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Subscribe</span>
                </div>
              )}
            </Button>
          </form>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-accent rounded-lg p-6 ${className}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Never miss an update</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter for the latest design insights and project showcases.
            </p>
            {isSubscribed ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !email}>
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary" />
          <span>Newsletter</span>
        </CardTitle>
        <CardDescription>
          Stay updated with our latest design insights, case studies, and project showcases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubscribed ? (
          <div className="flex items-center space-x-2 text-green-600 p-4 bg-green-50 rounded-lg">
            <Check className="h-5 w-5" />
            <div>
              <p className="font-medium">Thank you for subscribing!</p>
              <p className="text-sm text-green-600/80">
                You'll receive our newsletter with the latest updates.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </div>
              ) : (
                'Subscribe to Newsletter'
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;