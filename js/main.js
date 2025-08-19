// Main JavaScript functionality

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const contactModal = document.getElementById('contactModal');
const successModal = document.getElementById('successModal');

// Navigation Toggle
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on a link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// Smooth Scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Back to Top Button
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Header Background on Scroll
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.style.background = 'hsla(var(--background), 0.98)';
    } else {
      header.style.background = 'hsla(var(--background), 0.95)';
    }
  });
}

// Active Navigation Link
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.offsetHeight;
    
    if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Contact Form Modal Functions
function openContactForm(service = '') {
  if (contactModal) {
    const modalService = document.getElementById('modalService');
    const modalTitle = document.getElementById('modalTitle');
    
    if (service && modalService) {
      modalService.value = service;
    }
    
    if (modalTitle) {
      modalTitle.textContent = service ? `Get Your ${service}` : 'Get Your Free Quote';
    }
    
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactModal() {
  if (contactModal) {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    const form = document.getElementById('modalContactForm');
    if (form) form.reset();
  }
}

function closeSuccessModal() {
  if (successModal) {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modals when clicking outside
if (contactModal) {
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
  });
}

if (successModal) {
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeSuccessModal();
    }
  });
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeContactModal();
    closeSuccessModal();
  }
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, observerOptions);

// Observe animated elements
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate-fade-in-up');
  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
  updateActiveNavLink();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('Tukang Design website loaded successfully!');
  
  // Any initialization code can go here
  updateActiveNavLink();
  
  // Add loading animation completion
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Make functions globally available
window.openContactForm = openContactForm;
window.closeContactModal = closeContactModal;
window.closeSuccessModal = closeSuccessModal;