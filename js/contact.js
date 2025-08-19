// Contact form functionality

// Contact form submission handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const modalContactForm = document.getElementById('modalContactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmission);
  }

  if (modalContactForm) {
    modalContactForm.addEventListener('submit', handleModalContactSubmission);
  }
});

async function handleContactSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  await submitContactForm(data, form);
}

async function handleModalContactSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  await submitContactForm(data, form);
  closeContactModal();
}

async function submitContactForm(data, form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  try {
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      throw new Error('Please fill in all required fields.');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Please enter a valid email address.');
    }
    
    // Submit to form service (you can replace this with your preferred service)
    const success = await submitToFormService(data);
    
    if (success) {
      showSuccessModal();
      form.reset();
    } else {
      throw new Error('Failed to send message. Please try again.');
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    showErrorMessage(error.message || 'An error occurred. Please try again.');
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

async function submitToFormService(data) {
  try {
    // Option 1: Use Formspree (replace with your Formspree endpoint)
    // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    
    // Option 2: Use Netlify Forms (if deployed on Netlify)
    // const response = await fetch('/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     'form-name': 'contact',
    //     ...data
    //   }).toString()
    // });
    
    // Option 3: Use EmailJS (free email service)
    // You would need to include EmailJS SDK and configure it
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (replace with actual API call)
    console.log('Contact form submitted:', data);
    
    // Send to WhatsApp as backup
    sendToWhatsApp(data);
    
    return true;
    
  } catch (error) {
    console.error('Form service error:', error);
    
    // Fallback: redirect to WhatsApp
    sendToWhatsApp(data);
    return true;
  }
}

function sendToWhatsApp(data) {
  const message = `
*New Website Inquiry*

*Name:* ${data.name}
*Email:* ${data.email}
${data.service ? `*Service:* ${data.service}` : ''}

*Message:*
${data.message}
  `.trim();
  
  const whatsappUrl = `https://wa.me/60123456789?text=${encodeURIComponent(message)}`;
  
  // Open WhatsApp in a new tab after a short delay
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 2000);
}

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

// Add error toast styles
const errorToastStyles = `
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

document.head.insertAdjacentHTML('beforeend', errorToastStyles);

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone number validation helper (optional)
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
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

// Add field error styles
const fieldErrorStyles = `
<style>
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
</style>
`;

document.head.insertAdjacentHTML('beforeend', fieldErrorStyles);