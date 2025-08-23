// Main JavaScript functionality

// Ensure DOM is fully loaded
function initializeWhenReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Enhanced DOM Elements with error checking
function getDOMElements() {
  return {
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    backToTop: document.getElementById('backToTop'),
    contactModal: document.getElementById('contactModal'),
    successModal: document.getElementById('successModal'),
    heroBg: document.querySelector('.hero-bg'),
    heroSection: document.querySelector('.hero')
  };
}

let elements = {};

// Initialize all functionality
initializeWhenReady(() => {
  elements = getDOMElements();
  console.log('Tukang Design: Initializing all features...');
  
  // Initialize all components
  initNavigation();
  initSmoothScrolling();
  initBackToTop();
  initActiveNavLink();
  initModals();
  initMagneticDots();
  initScrollAnimations();
  initProblemCardTouchInteraction(); // Add mobile touch interaction
  
  console.log('Tukang Design: All features initialized successfully!');
});

// Navigation functionality
function initNavigation() {
  const { navToggle, navMenu } = elements;
  
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
}

// Smooth scrolling
function initSmoothScrolling() {
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
}

// Back to top functionality
function initBackToTop() {
  const { backToTop } = elements;
  
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Active navigation link
function initActiveNavLink() {
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 100) {
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
}

// Magnetic Dots System - Enhanced for compatibility
function initMagneticDots() {
  const { heroBg, heroSection } = elements;
  
  console.log('Initializing magnetic dots...', { heroBg: !!heroBg, heroSection: !!heroSection });
  
  if (!heroBg || !heroSection) {
    console.warn('Hero elements not found, skipping magnetic dots');
    return;
  }

  let dots = [];
  let animationId = null;
  
  function createDots() {
    try {
      console.log('Creating magnetic dots...');
      
      // Clear existing dots
      heroBg.innerHTML = '';
      dots = [];
      
      // Get dimensions
      const rect = heroSection.getBoundingClientRect();
      const dotSpacing = 24;
      const cols = Math.ceil(rect.width / dotSpacing);
      const rows = Math.ceil(rect.height / dotSpacing);
      
      console.log(`Creating ${cols}x${rows} = ${cols * rows} dots`);
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const dot = document.createElement('div');
          dot.className = 'hero-dot';
          dot.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(79, 209, 197, 0.6);
            border-radius: 50%;
            transition: all 0.2s ease-out;
            will-change: transform, opacity;
            left: ${col * dotSpacing}px;
            top: ${row * dotSpacing}px;
            z-index: 1;
            opacity: 0.6;
          `;
          
          heroBg.appendChild(dot);
          
          dots.push({
            element: dot,
            originalX: col * dotSpacing,
            originalY: row * dotSpacing,
            currentX: col * dotSpacing,
            currentY: row * dotSpacing
          });
        }
      }
      
      console.log(`Successfully created ${dots.length} dots`);
    } catch (error) {
      console.error('Error creating dots:', error);
    }
  }
  
  function updateDotsPosition(e) {
    if (!heroSection || dots.length === 0) return;
    
    try {
      const rect = heroSection.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const repulsionRadius = 120;
      
      dots.forEach(dot => {
        if (!dot.element) return;
        
        const deltaX = dot.originalX - cursorX;
        const deltaY = dot.originalY - cursorY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < repulsionRadius && distance > 0) {
          const force = (repulsionRadius - distance) / repulsionRadius;
          const angle = Math.atan2(deltaY, deltaX);
          const repulsionDistance = force * 20;
          
          dot.currentX = dot.originalX + Math.cos(angle) * repulsionDistance;
          dot.currentY = dot.originalY + Math.sin(angle) * repulsionDistance;
          
          // Increase opacity for dots within the affected area
          const opacityBoost = 0.8 + (force * 0.2); // Range from 0.8 to 1.0
          dot.element.style.opacity = opacityBoost;
        } else {
          dot.currentX = dot.originalX;
          dot.currentY = dot.originalY;
          
          // Reset to default opacity
          dot.element.style.opacity = 0.6;
        }
        
        const translateX = dot.currentX - dot.originalX;
        const translateY = dot.currentY - dot.originalY;
        dot.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    } catch (error) {
      console.error('Error updating dots:', error);
    }
  }
  
  function resetDotsPosition() {
    dots.forEach(dot => {
      if (dot.element) {
        dot.currentX = dot.originalX;
        dot.currentY = dot.originalY;
        dot.element.style.transform = 'translate(0px, 0px)';
        dot.element.style.opacity = 0.6; // Reset to default opacity
      }
    });
  }
  
  // Initialize dots
  createDots();
  
  // Add event listeners
  heroSection.addEventListener('mousemove', (e) => {
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(() => updateDotsPosition(e));
  });
  
  heroSection.addEventListener('mouseleave', resetDotsPosition);
  
  // Recreate on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createDots, 250);
  });
  
  // Force recreate after a delay to ensure layout is complete
  setTimeout(createDots, 1000);
}

// Scroll animations
function initScrollAnimations() {
  // Enhanced intersection observer with fallback
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  try {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      // Observe all sections with animations
      document.querySelectorAll('.problems, .services').forEach(section => {
        observer.observe(section);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      console.warn('IntersectionObserver not supported, using fallback');
      setTimeout(() => {
        document.querySelectorAll('.problems, .services').forEach(section => {
          section.classList.add('animate-in');
        });
      }, 1000);
    }
  } catch (error) {
    console.error('Error setting up scroll animations:', error);
  }
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
  // Track contact form opening
  if (typeof analytics !== 'undefined') {
    analytics.trackContactFormEvent('form_opened');
  }
  
  if (contactModal) {
    const modalService = document.getElementById('modalService');
    const modalTitle = document.getElementById('modalTitle');
    
    // Set the service in the dropdown
    if (service && modalService) {
      // If specific service is provided, select it
      modalService.value = service;
    } else {
      // Reset to default option
      modalService.value = '';
    }
    
    // Update modal title
    if (modalTitle) {
      modalTitle.textContent = service ? `Get Your ${service}` : 'Get Your Free Quote';
    }
    
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input for better UX
    setTimeout(() => {
      const nameInput = document.getElementById('modalName');
      if (nameInput) nameInput.focus();
    }, 100);
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

// Modal initialization
function initModals() {
  const { contactModal, successModal } = elements;
  
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
}

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

// Mobile touch interaction for problem cards
function initProblemCardTouchInteraction() {
  // Only add touch interaction on mobile devices
  if (window.innerWidth <= 768) {
    const problemCards = document.querySelectorAll('.problem-card');
    
    problemCards.forEach(card => {
      let isExpanded = false;
      
      // Handle touch/click events
      card.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Toggle expanded state
        if (isExpanded) {
          card.classList.remove('tapped');
          isExpanded = false;
        } else {
          // Close other expanded cards first
          problemCards.forEach(otherCard => {
            if (otherCard !== card) {
              otherCard.classList.remove('tapped');
            }
          });
          
          // Expand this card
          card.classList.add('tapped');
          isExpanded = true;
          
          // Auto-collapse after 5 seconds
          setTimeout(() => {
            if (card.classList.contains('tapped')) {
              card.classList.remove('tapped');
              isExpanded = false;
            }
          }, 5000);
        }
      });
      
      // Handle touch events for better mobile experience
      card.addEventListener('touchstart', (e) => {
        card.style.transform = 'translateY(-2px)';
      });
      
      card.addEventListener('touchend', (e) => {
        if (!card.classList.contains('tapped')) {
          card.style.transform = '';
        }
      });
    });
  }
  
  // Re-initialize on window resize
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth <= 768) {
      initProblemCardTouchInteraction();
    } else {
      // Remove mobile interactions on desktop
      const problemCards = document.querySelectorAll('.problem-card');
      problemCards.forEach(card => {
        card.classList.remove('tapped');
        card.style.transform = '';
      });
    }
  }, 250));
}