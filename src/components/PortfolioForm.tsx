import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  details: z.string().min(1, "Details are required"),
  client: z.string().optional(),
  timeline: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface PortfolioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  portfolio?: any;
}

export const PortfolioForm = ({ isOpen, onClose, onSuccess, portfolio }: PortfolioFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      description: "",
      details: "",
      client: "",
      timeline: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (portfolio) {
      form.reset({
        title: portfolio.title || "",
        slug: portfolio.slug || "",
        category: portfolio.category || "",
        description: portfolio.description || "",
        details: portfolio.details || "",
        client: portfolio.client || "",
        timeline: portfolio.timeline || "",
        status: portfolio.status || "draft",
      });
      setServices(portfolio.services ? JSON.parse(JSON.stringify(portfolio.services)) : []);
    } else {
      form.reset({
        title: "",
        slug: "",
        category: "",
        description: "",
        details: "",
        client: "",
        timeline: "",
        status: "draft",
      });
      setServices([]);
    }
    setImages([]);
  }, [portfolio, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setServices(services.filter(s => s !== service));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (portfolioId: string) => {
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${portfolioId}/${Date.now()}-${index}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('portfolio_images')
        .insert({
          portfolio_id: portfolioId,
          image_url: publicUrl,
          alt_text: `${form.getValues('title')} - Image ${index + 1}`,
          is_main: index === 0,
          sort_order: index,
        });

      if (dbError) throw dbError;
    });

    await Promise.all(uploadPromises);
  };

  const onSubmit = async (data: PortfolioFormData) => {
    setLoading(true);
    try {
      if (portfolio) {
        // Update existing portfolio
        const { error } = await supabase
          .from('portfolios')
          .update({
            title: data.title,
            slug: data.slug,
            category: data.category,
            description: data.description,
            details: data.details,
            client: data.client,
            timeline: data.timeline,
            status: data.status,
            services: services,
          })
          .eq('id', portfolio.id);

        if (error) throw error;

        if (images.length > 0) {
          await uploadImages(portfolio.id);
        }
      } else {
        // Create new portfolio
        const { data: portfolioData, error } = await supabase
          .from('portfolios')
          .insert({
            title: data.title,
            slug: data.slug,
            category: data.category,
            description: data.description,
            details: data.details,
            client: data.client,
            timeline: data.timeline,
            status: data.status,
            services: services,
          })
          .select()
          .maybeSingle();

        if (error) throw error;

        if (images.length > 0) {
          await uploadImages(portfolioData.id);
        }
      }

      toast({
        title: "Success",
        description: `Portfolio ${portfolio ? 'updated' : 'created'} successfully`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${portfolio ? 'update' : 'create'} portfolio`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {portfolio ? 'Edit Portfolio' : 'Create New Portfolio'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                onChange={(e) => {
                  form.setValue("title", e.target.value);
                  form.setValue("slug", generateSlug(e.target.value));
                }}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...form.register("slug")} />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...form.register("category")} />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value as "draft" | "published")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="details">Details</Label>
            <Textarea id="details" {...form.register("details")} rows={4} />
            {form.formState.errors.details && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.details.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <Input id="client" {...form.register("client")} />
            </div>

            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input id="timeline" {...form.register("timeline")} />
            </div>
          </div>

          <div>
            <Label>Services</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add a service"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
              />
              <Button type="button" onClick={addService} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <Badge key={service} variant="secondary" className="flex items-center gap-1">
                  {service}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeService(service)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Images</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Click to upload images</p>
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (portfolio ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};