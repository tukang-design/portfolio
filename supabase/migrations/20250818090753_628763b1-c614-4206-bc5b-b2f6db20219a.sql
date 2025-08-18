-- Create contact inquiries table for lead management
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_interest TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for contact inquiries
CREATE POLICY "Admins can manage contact inquiries" 
ON public.contact_inquiries 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contact_inquiries_updated_at
BEFORE UPDATE ON public.contact_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();