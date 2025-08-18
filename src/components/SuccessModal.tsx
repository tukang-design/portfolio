import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, MessageCircle, Mail, Clock } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewInquiry: () => void;
}

const SuccessModal = ({ isOpen, onClose, onNewInquiry }: SuccessModalProps) => {
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      "Hi! I just submitted an inquiry through your website. Looking forward to hearing from you!"
    );
    window.open(`https://wa.me/60123456789?text=${message}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="font-heading text-2xl text-primary">
            Message Sent Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your inquiry! Your request has been received and we'll get back to you soon.
          </p>

          <div className="bg-primary-light/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-sm">Response Time</p>
                <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-sm">Contact Email</p>
                <p className="text-sm text-muted-foreground">studio@tukang.design</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="cta" 
              size="lg" 
              className="w-full"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat on WhatsApp
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={onNewInquiry}
              >
                New Inquiry
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;