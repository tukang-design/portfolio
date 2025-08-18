import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServiceContext {
  title: string;
  features: string[];
  description: string;
}

export const useContactForm = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState<string>("");
  const [contextData, setContextData] = useState<ServiceContext | undefined>();

  const openContactForm = (service?: string, context?: ServiceContext) => {
    setPreSelectedService(service || "");
    setContextData(context);
    setIsContactFormOpen(true);
  };

  const closeContactForm = () => {
    setIsContactFormOpen(false);
    setPreSelectedService("");
    setContextData(undefined);
  };

  const handleFormSuccess = () => {
    setIsContactFormOpen(false);
    setIsSuccessModalOpen(true);
  };

  const submitContactInquiry = async (formData: {
    name: string;
    email: string;
    phone?: string;
    service: string;
    budget?: string;
    timeline?: string;
    message: string;
  }) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_interest: formData.service,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
          source: 'website'
        });

      if (error) {
        console.error('Error submitting contact inquiry:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to submit contact inquiry:', error);
      throw error;
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const openNewInquiry = () => {
    setIsSuccessModalOpen(false);
    setIsContactFormOpen(true);
    setPreSelectedService("");
    setContextData(undefined);
  };

  // Service contexts
  const serviceContexts = {
    brandFoundation: {
      title: "Brand Foundation Package",
      description: "Perfect for new businesses or those needing a serious refresh. We build a brand that you can be proud of.",
      features: [
        "Custom Logo Design Suite (multiple variations for all your needs)",
        "Professional Colour Palette",
        "Strategic Typography Styles",
        "Starter Brand Guideline"
      ]
    },
    website: {
      title: "Go-Live Website Package",
      description: "Your 24/7 digital storefront. We create a professional, effective website designed to turn visitors into customers.",
      features: [
        "1-Year Domain & Hosting Included",
        "Up to 3 Custom-Designed Pages (e.g., Home, About, Services/Contact)",
        "Mobile-Responsive Layout (looks perfect on any device)",
        "Contact Form & WhatsApp Integration (get inquiries instantly)"
      ]
    }
  };

  return {
    isContactFormOpen,
    isSuccessModalOpen,
    preSelectedService,
    contextData,
    openContactForm,
    closeContactForm,
    handleFormSuccess,
    closeSuccessModal,
    openNewInquiry,
    submitContactInquiry,
    serviceContexts
  };
};