// EmailJS Configuration Helper
// Run this in the browser console after getting your EmailJS keys

function configureEmailJS(serviceId, templateId, publicKey) {
  console.log('🔧 Configuring EmailJS...');
  
  // Update the EMAIL_CONFIG object
  window.EMAIL_CONFIG = {
    toEmail: 'studio@tukang.design',
    emailjsServiceId: serviceId,
    emailjsTemplateId: templateId,
    emailjsPublicKey: publicKey
  };
  
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(publicKey);
    console.log('✅ EmailJS initialized with new keys');
  }
  
  console.log('✅ EmailJS configured successfully!');
  console.log('You can now test the contact form');
  
  return window.EMAIL_CONFIG;
}

// Example usage:
// configureEmailJS('service_abc123', 'template_contact_form', 'user_xyz789');

console.log('📧 EmailJS Configuration Helper loaded');
console.log('Use: configureEmailJS("your_service_id", "template_contact_form", "your_public_key")');
