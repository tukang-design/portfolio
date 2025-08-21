// Contact Form Handling with Automatic Email Sending
// Multiple fallback methods for reliable email delivery

// Configuration
const EMAIL_CONFIG = {
  toEmail: 'studio@tukang.design',
  emailjsServiceId: 'service_5dm9j7o', // Your EmailJS Service ID
  emailjsTemplateId: 'template_m7c3xzk', // Your actual EmailJS Template ID
  emailjsPublicKey: 'H8BsO0E-u0xNaYTbr' // Your EmailJS Public Key
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('📧 Initializing contact form...');
  
  // Initialize EmailJS if available
  if (typeof emailjs !== 'undefined') {
    console.log('✅ EmailJS library found');
    emailjs.init(EMAIL_CONFIG.emailjsPublicKey);
    console.log('✅ EmailJS initialized with public key:', EMAIL_CONFIG.emailjsPublicKey);
  } else {
    console.log('❌ EmailJS library not found - check if script is loaded');
  }
  
  // Log configuration
  console.log('📧 EmailJS Configuration:', EMAIL_CONFIG);
  
  // Attach form listeners
  const contactForms = document.querySelectorAll('#contactForm, .contact-form, #modalContactForm');
  console.log('📧 Found contact forms:', contactForms.length);
  
  contactForms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
  
  // Close modal functionality
  const successModal = document.getElementById('successModal');
  if (successModal) {
    const closeBtn = successModal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Close on backdrop click
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  console.log('📧 Contact form initialized for automatic email sending');
});

// Main form submission handler
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : '';
  
  // Track form submission attempt
  if (typeof analytics !== 'undefined') {
    analytics.trackContactFormEvent('form_submission_attempt');
  }
  
  // Show loading state
  if (submitBtn) {
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
  }
  
  try {
    // Collect form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      message: formData.get('message')
    };
    
    // Track service interest
    if (typeof analytics !== 'undefined' && data.service) {
      analytics.trackServiceInterest(data.service);
    }
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      throw new Error('Please fill in all required fields');
    }
    
    if (!isValidEmail(data.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Try multiple email sending methods
    let emailSent = false;
    
    console.log('🔍 Checking EmailJS availability...');
    console.log('EmailJS defined:', typeof emailjs !== 'undefined');
    console.log('Public key configured:', EMAIL_CONFIG.emailjsPublicKey !== 'YOUR_PUBLIC_KEY');
    console.log('EmailJS config:', EMAIL_CONFIG);
    
    // Method 1: EmailJS (Primary method for automatic sending)
    if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.emailjsPublicKey !== 'YOUR_PUBLIC_KEY') {
      try {
        console.log('🚀 Attempting EmailJS send...');
        await sendViaEmailJS(data);
        emailSent = true;
        console.log('✅ Email sent via EmailJS');
      } catch (error) {
        console.log('❌ EmailJS failed:', error);
        console.log('Error details:', error.message);
      }
    } else {
      console.log('⚠️ EmailJS not available or not configured properly');
      if (typeof emailjs === 'undefined') {
        console.log('❌ EmailJS library not loaded');
      }
      if (EMAIL_CONFIG.emailjsPublicKey === 'YOUR_PUBLIC_KEY') {
        console.log('❌ EmailJS public key not configured');
      }
    }
    
    // Method 2: Netlify Forms (if deployed on Netlify)    // Method 2: Netlify Forms (if deployed on Netlify)
    if (!emailSent) {
      try {
        await sendViaNetlifyForms(form, data);
        emailSent = true;
        console.log('✅ Email sent via Netlify Forms');
      } catch (error) {
        console.log('❌ Netlify Forms failed:', error.message);
      }
    }
    
    // Method 2: PHP Script (if available)
    if (!emailSent) {
      try {
        await sendViaPHPScript(data);
        emailSent = true;
        console.log('✅ Email sent via PHP script');
      } catch (error) {
        console.log('❌ PHP script failed:', error.message);
      }
    }
    
    // Method 3: EmailJS (if configured)
    if (!emailSent && typeof emailjs !== 'undefined') {
      try {
        await sendViaEmailJS(data);
        emailSent = true;
        console.log('✅ Email sent via EmailJS');
      } catch (error) {
        console.log('❌ EmailJS failed:', error.message);
      }
    }
    
    // Success - show modal and reset form
    if (emailSent) {
      // Track successful email submission
      if (typeof analytics !== 'undefined') {
        analytics.trackEmailSubmission(true);
      }
      
      showSuccessModal();
      form.reset();
      console.log('📧 Contact form submitted successfully');
    } else {
      // Track failed email submission
      if (typeof analytics !== 'undefined') {
        analytics.trackEmailSubmission(false);
      }
      
      // All methods failed - show error instead of fallback
      console.log('❌ All email methods failed');
      showErrorMessage('Unable to send email at this time. Please try again later or contact us directly at studio@tukang.design');
    }
    
  } catch (error) {
    console.error('Form submission error:', error);
    showErrorMessage(error.message || 'Failed to send message. Please try again.');
  } finally {
    // Reset button state
    if (submitBtn) {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

// Method 1: Test webhook (for debugging)
async function sendViaFormspree(data) {
  // For testing - this will show us if the form submission is working
  const response = await fetch('https://webhook.site/1a2b3c4d-test-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: EMAIL_CONFIG.toEmail,
      name: data.name,
      email: data.email,
      service: data.service || 'General Inquiry',
      message: data.message,
      timestamp: new Date().toISOString()
    })
  });
  
  console.log('📧 Form data sent to test webhook:', {
    to: EMAIL_CONFIG.toEmail,
    name: data.name,
    email: data.email,
    service: data.service,
    message: data.message
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

// Method 2: Netlify Forms
async function sendViaNetlifyForms(form, data) {
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'form-name': 'contact',
      'name': data.name,
      'email': data.email,
      'service': data.service || '',
      'message': data.message
    }).toString()
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

// Method 2: PHP Script
async function sendViaPHPScript(data) {
  const response = await fetch('/send-email.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: EMAIL_CONFIG.toEmail,
      name: data.name,
      email: data.email,
      service: data.service || 'General Inquiry',
      message: data.message
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'PHP script failed');
  }
}

// Method 3: EmailJS
async function sendViaEmailJS(data) {
  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    service_type: data.service || 'General Inquiry',
    message: data.message,
    to_email: EMAIL_CONFIG.toEmail
  };
  
  console.log('📧 Sending email via EmailJS with params:', templateParams);
  
  const response = await emailjs.send(
    EMAIL_CONFIG.emailjsServiceId,
    EMAIL_CONFIG.emailjsTemplateId,
    templateParams
  );
  
  console.log('📧 EmailJS Response:', response);
  
  if (response.status !== 200) {
    throw new Error(`EmailJS error: ${response.status} - ${response.text}`);
  }
}

// Fallback: Pre-filled mailto link
function createMailtoLink(data) {
  const subject = `Contact Form Inquiry from ${data.name}`;
  const body = `Hello,

I am sending this inquiry from your website:

Name: ${data.name}
Email: ${data.email}
Service Interested: ${data.service || 'General Inquiry'}

Message:
${data.message}

Please respond to this email directly.

Best regards,
${data.name}`;

  console.log('📧 EMAIL CONTENT TO BE SENT:');
  console.log('To:', EMAIL_CONFIG.toEmail);
  console.log('Subject:', subject);
  console.log('Body:', body);
  console.log('---');

  const mailtoUrl = `mailto:${EMAIL_CONFIG.toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Create a temporary link and click it
  const tempLink = document.createElement('a');
  tempLink.href = mailtoUrl;
  tempLink.style.display = 'none';
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  
  console.log('📧 Pre-filled email created for:', EMAIL_CONFIG.toEmail);
}

// UI Helper Functions
function showSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function showErrorMessage(message) {
  // Create and show error toast
  const errorToast = document.createElement('div');
  errorToast.className = 'error-toast';
  errorToast.innerHTML = `
    <div class="error-toast-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(errorToast);
  
  // Animate in
  setTimeout(() => errorToast.classList.add('show'), 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    errorToast.classList.remove('show');
    setTimeout(() => errorToast.remove(), 300);
  }, 5000);
}

// Validation Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Form field validation on blur
document.addEventListener('DOMContentLoaded', () => {
  const emailInputs = document.querySelectorAll('input[type="email"]');
  const nameInputs = document.querySelectorAll('input[name="name"]');
  
  emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value && !isValidEmail(input.value)) {
        input.style.borderColor = 'hsl(var(--destructive))';
        showFieldError(input, 'Please enter a valid email address');
      } else {
        input.style.borderColor = '';
        hideFieldError(input);
      }
    });
  });
  
  nameInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value && input.value.length < 2) {
        input.style.borderColor = 'hsl(var(--destructive))';
        showFieldError(input, 'Name must be at least 2 characters');
      } else {
        input.style.borderColor = '';
        hideFieldError(input);
      }
    });
  });
});

function showFieldError(input, message) {
  hideFieldError(input); // Remove existing error
  
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  
  input.parentNode.appendChild(errorElement);
}

function hideFieldError(input) {
  const existingError = input.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}

// Add styles for error handling and toasts
const contactStyles = `
<style>
.error-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: hsl(var(--destructive));
  color: hsl(var(--destructive-foreground));
  padding: 1rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-bold);
  z-index: 3000;
  transform: translateX(100%);
  transition: var(--transition-smooth);
  max-width: 400px;
}

.error-toast.show {
  transform: translateX(0);
}

.error-toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-toast svg {
  flex-shrink: 0;
}

.field-error {
  color: hsl(var(--destructive));
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
  border-color: hsl(var(--destructive));
  box-shadow: 0 0 0 2px hsla(var(--destructive), 0.2);
}

@media (max-width: 768px) {
  .error-toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', contactStyles);

// Test function for EmailJS (call this from browser console)
window.testEmailJS = function() {
  if (EMAIL_CONFIG.emailjsPublicKey === 'YOUR_PUBLIC_KEY') {
    console.log('❌ Please configure EmailJS first by updating the keys in contact.js');
    return;
  }
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    service: 'Test Service',
    message: 'This is a test message from the EmailJS integration.'
  };
  
  console.log('🧪 Testing EmailJS with test data...');
  
  sendViaEmailJS(testData)
    .then(() => {
      console.log('✅ EmailJS test successful! Check studio@tukang.design for the test email.');
    })
    .catch(error => {
      console.log('❌ EmailJS test failed:', error);
    });
};

console.log('📧 EmailJS test function available: testEmailJS()');