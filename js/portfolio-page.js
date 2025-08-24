// Portfolio Page Enhanced Functionality

// Global variables for portfolio functionality
let currentFullscreenProject = 0;
let isFullscreenActive = false;
let currentStoryImages = [];
let storyCurrentImageIndex = 0;
let storyInterval = null;
let isStoryPaused = false;
let isStoryProgressing = false; // Add flag to prevent multiple progressions

// Immediately define and export essential functions
window.openFullscreenView = function(projectId) {
  console.log('🚀 Opening fullscreen view for project:', projectId);
  
  try {
    const fullscreenSection = document.getElementById('portfolioFullscreen');
    if (!fullscreenSection) {
      console.error('❌ Fullscreen section not found!');
      return;
    }
    
    console.log('✅ Fullscreen section found');
    
    // Find project data
    const project = enhancedPortfolioData[projectId - 1];
    if (!project) {
      console.error('❌ Project not found!');
      return;
    }
    
    console.log('✅ Project found:', project.title);
    
    // Show fullscreen section
    fullscreenSection.style.display = 'block';
    fullscreenSection.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update content - safe approach
    const updateElement = (selector, content) => {
      const el = fullscreenSection.querySelector(selector);
      if (el) el.textContent = content;
    };
    
    updateElement('.project-type', project.services[0] || 'Project');
    updateElement('.fullscreen-title', project.title);
    updateElement('.fullscreen-title-expanded', project.title);
    updateElement('.fullscreen-description', project.description);
    updateElement('[data-client] .meta-value', project.client);
    updateElement('[data-timeline] .meta-value', project.timeline);
    updateElement('[data-year] .meta-value', project.year);
    
    // Update services
    const servicesEl = fullscreenSection.querySelector('.services-tags');
    if (servicesEl) {
      servicesEl.innerHTML = project.services.map(service => 
        `<span class="service-tag">${service}</span>`
      ).join('');
    }
    
    // Set background image and start story
    const backgroundImg = fullscreenSection.querySelector('.fullscreen-background img');
    if (backgroundImg && project.images && project.images.length > 0) {
      console.log('🎬 Starting story with images:', project.images);
      backgroundImg.src = project.images[0];
      console.log('🖼️ Initial image set to:', project.images[0]);
      
      // Initialize story state
      currentStoryImages = project.images;
      storyCurrentImageIndex = 0;
      currentFullscreenProject = projectId;
      isStoryProgressing = false; // Reset progression flag
      
      // Clear any existing animations
      if (window.storyAnimationId) {
        cancelAnimationFrame(window.storyAnimationId);
        window.storyAnimationId = null;
      }
      
      console.log('📊 Story initialized - currentStoryImages:', currentStoryImages.length, 'images');
      
      // Reset all progress bars
      const progressSegments = document.querySelectorAll('.progress-segment .progress-fill');
      progressSegments.forEach(fill => fill.style.width = '0%');
      
      // Hide CTA initially
      const ctaOverlay = document.getElementById('storyCTA');
      if (ctaOverlay) ctaOverlay.style.display = 'none';
      
      // Start story progression after a brief delay
      setTimeout(() => {
        if (typeof progressToNextImage === 'function') {
          console.log('🚀 Starting story progression...');
          progressToNextImage();
        }
      }, 500);
    }
    
    console.log('✅ Fullscreen view opened successfully');
    
  } catch (error) {
    console.error('❌ Error opening fullscreen view:', error);
  }
};

window.exitFullscreenView = function() {
  console.log('🚪 Closing fullscreen view');
  
  // Stop any ongoing story progression
  isStoryProgressing = false;
  isStoryPaused = false;
  
  // Cancel animations
  if (window.storyAnimationId) {
    cancelAnimationFrame(window.storyAnimationId);
    window.storyAnimationId = null;
  }
  
  const fullscreenSection = document.getElementById('portfolioFullscreen');
  if (fullscreenSection) {
    fullscreenSection.style.display = 'none';
    fullscreenSection.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.jumpToImage = function(imageIndex) {
  console.log('⏭️ Jumping to image:', imageIndex);
  if (!currentStoryImages || imageIndex >= currentStoryImages.length || imageIndex < 0) return;
  
  // Clear any ongoing animations
  if (window.storyAnimationId) {
    cancelAnimationFrame(window.storyAnimationId);
  }
  
  // Reset all progress bars
  const progressSegments = document.querySelectorAll('.progress-segment');
  progressSegments.forEach((segment, index) => {
    const progressFill = segment.querySelector('.progress-fill');
    if (progressFill) {
      if (index < imageIndex) {
        // Fill completed segments
        progressFill.style.width = '100%';
      } else {
        // Reset future segments
        progressFill.style.width = '0%';
      }
    }
  });
  
  // Update current image
  storyCurrentImageIndex = imageIndex;
  const backgroundImg = document.querySelector('.fullscreen-background img');
  if (backgroundImg && currentStoryImages[imageIndex]) {
    backgroundImg.src = currentStoryImages[imageIndex];
  }
  
  // Resume progression from this point after a delay
  setTimeout(() => {
    if (typeof progressToNextImage === 'function') {
      progressToNextImage();
    }
  }, 600);
};

window.dismissCTAAndResume = function() {
  console.log('❌ Dismissing CTA');
  const overlay = document.getElementById('storyCTA');
  if (overlay) {
    overlay.style.display = 'none';
  }
};

console.log('✅ Essential functions loaded immediately');

// Enhanced portfolio data with additional projects and categories
const enhancedPortfolioData = [
  {
    id: '1',
    title: 'Kapitani: Farm Management App',
    category: 'UI Revamp & Design System Library',
    filterCategory: 'ui-ux',
    description: 'A complete UI and UX revamp of the Kapitani farm management app. The project included a new design system and integrated a myGAP pre-application process, streamlining farm task activities for an enhanced user experience.',
    details: 'This comprehensive project involved redesigning the entire user interface for a farm management application. We created a cohesive design system library that ensures consistency across all components while improving user experience through intuitive navigation and streamlined workflows.',
    image: 'src/assets/portfolio-kapitani-new.png',
    images: [
      'src/assets/portfolio-kapitani-new.png',
      'src/assets/portfolio-kapitani.jpg',
      'src/assets/portfolio-kapitani-2.png',
      'src/assets/portfolio-kapitani-3.jpg',
      'src/assets/portfolio-kapitani-4.png'
    ],
    services: ['UI/UX Revamp', 'Design System Library', 'App UI Design', 'UX Research'],
    timeline: '4 Months',
    client: 'Kapitani Technologies',
    year: '2024',
    challenge: 'Complex farm management workflows needed simplification',
    solution: 'Created an intuitive design system with streamlined user flows'
  },
  {
    id: '2',
    title: 'Raisuri: Junior Football Academy Club',
    category: 'Logo Redesign & Brand Expansion',
    filterCategory: 'branding',
    description: 'A total reimagining of the Raisuri Junior Football Academy\'s brand. The new logo is a modern, flexible, and scalable design that ensures brand consistency across all touchpoints, giving the club a young and passionate feel.',
    details: 'This branding project focused on creating a fresh, energetic identity for a youth football academy. We developed a complete brand system including logo variations, color palettes, typography, and application guidelines for sports uniforms and marketing materials.',
    image: 'src/assets/portfolio-raisuri-new.png',
    images: [
      'src/assets/portfolio-raisuri-new.png',
      'src/assets/portfolio-raisuri.jpg',
      'src/assets/portfolio-raisuri-2.png',
      'src/assets/portfolio-raisuri-3.jpg',
      'src/assets/portfolio-raisuri-4.png'
    ],
    services: ['Logo Redesign', 'Brand Identity', 'Kit Design', 'Visual Identity'],
    timeline: '2 Months',
    client: 'Raisuri Football Academy',
    year: '2024',
    challenge: 'Outdated brand identity didn\'t reflect the club\'s energy',
    solution: 'Modern, dynamic logo system with youthful appeal'
  },
  {
    id: '3',
    title: 'SAG Logistics: Local Logistics Solution Provider',
    category: 'Corporate Brand Refresh & Web Development',
    filterCategory: 'combo',
    description: 'A brand identity refresh for SA Global Logistics, starting with a new company profile design. This visual style was then expanded to a new website, ensuring a modern and cohesive brand presence across all digital platforms.',
    details: 'This comprehensive project combined brand refresh with modern web development. We created a professional corporate identity and translated it into a fully responsive website that showcases their logistics capabilities while maintaining user-friendly navigation.',
    image: 'src/assets/portfolio-sag-new.png',
    images: [
      'src/assets/portfolio-sag-new.png',
      'src/assets/portfolio-sag-logistics.jpg',
      'src/assets/portfolio-sag-2.png',
      'src/assets/portfolio-sag-3.jpg',
      'src/assets/portfolio-sag-4.png'
    ],
    services: ['Brand Identity Refresh', 'Corporate Profile Design', 'Web Design', 'Web Development'],
    timeline: '1 Month',
    client: 'SA Global Logistics',
    year: '2023',
    challenge: 'Disconnected brand and web presence',
    solution: 'Unified brand system with modern website implementation'
  },
  {
    id: '4',
    title: 'Youthopia: Junior Edu-tech Company',
    category: 'Logo Design & Brand Identity',
    filterCategory: 'branding',
    description: 'Designed a comprehensive brand identity and logo for a new edu-tech platform for kids. The visual identity targets both young students and their parents, with a design that is both playful and trustworthy.',
    details: 'This educational technology startup needed a brand that would appeal to both children and parents. We created a friendly yet professional identity system that builds trust while maintaining an approachable, fun character suitable for young learners.',
    image: 'src/assets/portfolio-youthopia-new.png',
    images: [
      'src/assets/portfolio-youthopia-new.png',
      'src/assets/portfolio-youthopia.jpg',
      'src/assets/portfolio-youthopia-2.png',
      'src/assets/portfolio-youthopia-3.jpg',
      'src/assets/portfolio-youthopia-4.png'
    ],
    services: ['Logo Design', 'Brand Identity', 'Brand Guidelines', 'Educational Branding'],
    timeline: '3 Months',
    client: 'Youthopia Education',
    year: '2023',
    challenge: 'Balancing playful appeal with parental trust',
    solution: 'Dual-appeal brand system with flexible applications'
  }
];

// Portfolio page initialization
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioPage();
  
  // Test click functionality
  console.log('🔍 Testing click functionality...');
  window.testClick = () => {
    console.log('✅ Test click works!');
    alert('Click test successful!');
  };
  
  // Test the openFullscreenView function directly
  window.testFullscreen = () => {
    console.log('🧪 Testing fullscreen function...');
    openFullscreenView('1');
  };
  
  // Ensure openFullscreenView is available globally
  console.log('🌐 openFullscreenView available:', typeof window.openFullscreenView);
});

function initPortfolioPage() {
  console.log('🎨 Initializing enhanced portfolio page...');
  
  // Load portfolio items
  renderEnhancedPortfolio();
  
  // Initialize filters
  initPortfolioFilters();
  
  // Initialize modal
  initPortfolioModal();
  
  // Add click handlers to existing portfolio cards
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-project-id]');
  console.log('🔍 Found portfolio cards:', portfolioCards.length);
  
  portfolioCards.forEach((card, index) => {
    const projectId = card.getAttribute('data-project-id');
    console.log(`📋 Adding click handler for project ${index + 1}:`, projectId);
    
    // Add click event listener (in addition to onclick attribute)
    card.addEventListener('click', (e) => {
      console.log('🖱️ Card clicked for project:', projectId, 'Event:', e);
      
      // Prevent event if clicking on button
      if (e.target.closest('button')) {
        console.log('🛑 Button clicked, stopping propagation');
        return;
      }
      
      console.log('🚀 Calling openFullscreenView for:', projectId);
      openFullscreenView(projectId);
    });
    
    // Ensure pointer cursor
    card.style.cursor = 'pointer';
    
    // Add a simple hover test
    card.addEventListener('mouseenter', () => {
      console.log('🐭 Mouse entered card:', projectId);
    });
  });
  
  console.log('✅ Portfolio page initialization complete');
}

// Enhanced portfolio rendering (now simplified for horizontal cards)
function renderEnhancedPortfolio(filterCategory = 'all') {
  const portfolioList = document.getElementById('portfolioList');
  if (!portfolioList) return;
  
  // Check if portfolio cards already exist in HTML (don't override)
  const existingCards = portfolioList.querySelectorAll('.portfolio-card');
  if (existingCards.length > 0 && filterCategory === 'all') {
    console.log('✅ Portfolio cards already loaded from HTML');
    return;
  }
  
  // This function is now mainly used for filtering, actual content is in HTML
  console.log('✅ Portfolio list structure ready');
}

// Portfolio filtering functionality
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.category-btn');
  const portfolioList = document.getElementById('portfolioList');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterCategory = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter portfolio cards
      const portfolioCards = document.querySelectorAll('.portfolio-card');
      
      portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          card.classList.remove('hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });
      
      // Add filtering effect
      portfolioList.style.opacity = '0.7';
      setTimeout(() => {
        portfolioList.style.opacity = '1';
      }, 200);
      
      // Track filter usage
      if (typeof gtag !== 'undefined') {
        gtag('event', 'portfolio_filter', {
          filter_category: filterCategory
        });
      }
    });
  });
}

// Enhanced modal functionality
function initPortfolioModal() {
  const modal = document.getElementById('portfolioModal');
  const closeBtn = document.getElementById('portfolioModalClose');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closePortfolioModal);
  }
  
  // Close modal on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePortfolioModal();
      }
    });
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePortfolioModal();
    }
  });
}

// Open portfolio modal with project details
function openPortfolioModal(projectId) {
  const modal = document.getElementById('portfolioModal');
  const modalBody = document.getElementById('portfolioModalBody');
  
  if (!modal || !modalBody) return;
  
  const project = enhancedPortfolioData.find(item => item.id === projectId);
  if (!project) return;
  
  // Generate modal content
  const modalContent = `
    <div class="modal-project-header">
      <div class="modal-project-category">${project.category}</div>
      <h2 class="modal-project-title">${project.title}</h2>
      <p class="modal-project-description">${project.details}</p>
    </div>
    
    <div class="modal-project-images">
      ${project.images.map(image => `
        <img src="${image}" alt="${project.title}" class="modal-project-image" loading="lazy">
      `).join('')}
    </div>
    
    <div class="modal-project-details">
      <div class="detail-item">
        <div class="detail-label">Client</div>
        <div class="detail-value">${project.client}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Timeline</div>
        <div class="detail-value">${project.timeline}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Services</div>
        <div class="detail-value">${project.services.join(', ')}</div>
      </div>
    </div>
    
    ${project.challenge ? `
      <div class="modal-project-details" style="margin-top: 2rem;">
        <div class="detail-item">
          <div class="detail-label">Challenge</div>
          <div class="detail-value">${project.challenge}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Solution</div>
          <div class="detail-value">${project.solution}</div>
        </div>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin-top: 3rem;">
      <button class="btn btn-cta" onclick="openContactForm(); closePortfolioModal();">
        Start Similar Project
      </button>
    </div>
  `;
  
  modalBody.innerHTML = modalContent;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Track modal opening
  if (typeof gtag !== 'undefined') {
    gtag('event', 'portfolio_view', {
      project_id: projectId,
      project_title: project.title
    });
  }
}

// Close portfolio modal
function closePortfolioModal() {
  const modal = document.getElementById('portfolioModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Animate portfolio cards on load
function animatePortfolioItems() {
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  portfolioCards.forEach((card, index) => {
    // Remove any existing animation classes
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    // Add animation with delay
    setTimeout(() => {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe all portfolio items
  document.querySelectorAll('.portfolio-item').forEach(item => {
    observer.observe(item);
  });
  
  // Observe other sections
  document.querySelectorAll('.portfolio-hero, .portfolio-filter-section, .portfolio-cta').forEach(section => {
    observer.observe(section);
  });
}

// Search functionality (bonus feature)
function initPortfolioSearch() {
  const searchInput = document.getElementById('portfolioSearch');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
      const title = item.querySelector('.portfolio-title').textContent.toLowerCase();
      const description = item.querySelector('.portfolio-description').textContent.toLowerCase();
      const category = item.querySelector('.portfolio-category').textContent.toLowerCase();
      
      const matches = title.includes(searchTerm) || 
                     description.includes(searchTerm) || 
                     category.includes(searchTerm);
      
      if (matches || searchTerm === '') {
        item.style.display = 'block';
        item.classList.remove('hidden');
      } else {
        item.style.display = 'none';
        item.classList.add('hidden');
      }
    });
    
    // Track search usage
    if (typeof gtag !== 'undefined' && searchTerm.length > 2) {
      gtag('event', 'portfolio_search', {
        search_term: searchTerm
      });
    }
  });
}

// Performance optimization: Lazy load images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Initialize all portfolio page features
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioPage();
  initScrollAnimations();
  initPortfolioSearch();
  initLazyLoading();
});

// Make functions globally available
window.openPortfolioModal = openPortfolioModal;
window.closePortfolioModal = closePortfolioModal;

// Fullscreen Interactive Portfolio View

// Open fullscreen view for specific project
function openFullscreenView(projectId) {
  console.log('🚀 Opening fullscreen view for project:', projectId);
  
  try {
    const fullscreenSection = document.getElementById('portfolioFullscreen');
    if (!fullscreenSection) {
      console.error('❌ Fullscreen section not found!');
      return;
    }
    
    console.log('✅ Fullscreen section found');
    
    // Find project index by ID
    const projectIndex = enhancedPortfolioData.findIndex(project => project.id === projectId);
    if (projectIndex === -1) {
      console.error('❌ Project not found:', projectId);
      return;
    }
    
    console.log('✅ Project found:', enhancedPortfolioData[projectIndex].title);
    
    const project = enhancedPortfolioData[projectIndex];
    
    // Set current project
    currentFullscreenProject = projectIndex;
  
  // Update content elements
  const backgroundImg = fullscreenSection.querySelector('.fullscreen-background img');
  const projectTypeEl = fullscreenSection.querySelector('.project-type-badge');
  const titleEl = fullscreenSection.querySelector('#projectTitle');
  const titleExpandedEl = fullscreenSection.querySelector('#projectTitleExpanded');
  const descriptionEl = fullscreenSection.querySelector('.fullscreen-description');
  const clientEl = fullscreenSection.querySelector('[data-client] .meta-value');
  const timelineEl = fullscreenSection.querySelector('[data-timeline] .meta-value');
  const yearEl = fullscreenSection.querySelector('[data-year] .meta-value');
  const servicesEl = fullscreenSection.querySelector('.services-tags');
  const ctaOverlay = fullscreenSection.querySelector('.story-cta-overlay');

  // Update content
  projectTypeEl.textContent = project.services[0] || 'Project';
  titleEl.textContent = project.title;
  titleExpandedEl.textContent = project.title;
  descriptionEl.textContent = project.description;
  clientEl.textContent = project.client;
  timelineEl.textContent = project.timeline;
  yearEl.textContent = project.year;

  // Update services tags
  servicesEl.innerHTML = project.services.map(service => 
    `<span class="service-tag">${service}</span>`
  ).join('');

  // Set initial image
  const images = project.images ? project.images : [project.image];
  backgroundImg.src = images[0];

  // Hide CTA overlay initially
  if (ctaOverlay) {
    ctaOverlay.style.display = 'none';
  }

  // Initialize progress bars based on number of images
  initializeProgressBars(images.length);

  // Initialize details panel in collapsed state
  const collapsedState = fullscreenSection.querySelector('#detailsCollapsed');
  const expandedState = fullscreenSection.querySelector('#detailsExpanded');
  collapsedState.style.display = 'flex';
  expandedState.style.display = 'none';

  // Show fullscreen view
  fullscreenSection.style.display = 'block';
  fullscreenSection.classList.add('active');
  document.body.style.overflow = 'hidden';
  isFullscreenActive = true;

  // Start story progression
  startStoryProgression(images);
  
  // Track fullscreen opening
  if (typeof gtag !== 'undefined') {
    gtag('event', 'portfolio_fullscreen_open', {
      project_id: projectId,
      project_title: project.title
    });
  }
  
  } catch (error) {
    console.error('❌ Error opening fullscreen view:', error);
  }
}

// Export immediately for onclick handlers
console.log('🔧 About to export openFullscreenView function...');
console.log('🔧 Function type:', typeof openFullscreenView);
window.openFullscreenView = openFullscreenView;
console.log('✅ openFullscreenView exported to window');
console.log('🔧 Window function type:', typeof window.openFullscreenView);

// Exit fullscreen view
function exitFullscreenView() {
  const fullscreenSection = document.getElementById('portfolioFullscreen');
  
  fullscreenSection.style.display = 'none';
  fullscreenSection.classList.remove('active');
  document.body.style.overflow = '';
  isFullscreenActive = false;
  
  // Clear any ongoing animations and story state
  if (window.storyAnimationId) {
    cancelAnimationFrame(window.storyAnimationId);
  }
  
  // Reset story variables
  currentStoryImages = [];
  storyCurrentImageIndex = 0;
  isStoryPaused = false;
  
  if (storyInterval) {
    clearInterval(storyInterval);
    storyInterval = null;
  }
}

window.exitFullscreenView = exitFullscreenView;

// Initialize progress bars based on number of images
function initializeProgressBars(imageCount) {
  const progressSegments = document.querySelectorAll('.progress-segment');
  
  // Show/hide segments based on image count (max 5)
  progressSegments.forEach((segment, index) => {
    if (index < Math.min(imageCount, 5)) {
      segment.style.display = 'block';
      // Reset progress
      const progressFill = segment.querySelector('.progress-fill');
      progressFill.style.width = '0%';
    } else {
      segment.style.display = 'none';
    }
  });
}

// Instagram story progression functions
function startStoryProgression(images) {
  currentStoryImages = images;
  storyCurrentImageIndex = 0;
  
  const backgroundImg = document.querySelector('.fullscreen-background img');
  backgroundImg.src = images[0];
  
  progressToNextImage();
}

function progressToNextImage() {
  if (isStoryPaused || isStoryProgressing) {
    console.log('⏸️ Story paused or already progressing, skipping...');
    return;
  }
  
  isStoryProgressing = true;
  console.log('🎬 Starting progress for image index:', storyCurrentImageIndex, 'of', currentStoryImages.length);
  
  fillProgressSegment(storyCurrentImageIndex, () => {
    console.log('✅ Progress bar', storyCurrentImageIndex, 'completed');
    
    // Move to next image after current progress bar is filled
    storyCurrentImageIndex++;
    
    console.log('➡️ Moving to image index:', storyCurrentImageIndex);
    
    if (storyCurrentImageIndex < currentStoryImages.length && storyCurrentImageIndex < 5) {
      // Move to next image with dissolve transition
      console.log('🖼️ Changing to image:', currentStoryImages[storyCurrentImageIndex]);
      changeImageWithDissolve(currentStoryImages[storyCurrentImageIndex]);
      
      // Reset flag and continue with next image progression
      isStoryProgressing = false;
      setTimeout(progressToNextImage, 100);
    } else {
      // All images shown, show CTA
      console.log('🎯 All images shown, showing CTA');
      isStoryProgressing = false;
      const project = enhancedPortfolioData[currentFullscreenProject - 1];
      if (project) {
        showCTAOverlay(project);
      }
    }
  });
}

function changeImageWithDissolve(newImageSrc) {
  const backgroundImg = document.querySelector('.fullscreen-background img');
  
  // Start dissolve transition
  backgroundImg.classList.add('dissolving');
  
  setTimeout(() => {
    backgroundImg.src = newImageSrc;
    backgroundImg.classList.remove('dissolving');
  }, 300); // Half of the CSS transition duration
}

function jumpToImage(imageIndex) {
  if (imageIndex >= currentStoryImages.length || imageIndex < 0) return;
  
  // Clear any ongoing animations
  if (window.storyAnimationId) {
    cancelAnimationFrame(window.storyAnimationId);
  }
  
  // Reset all progress bars
  const progressSegments = document.querySelectorAll('.progress-segment');
  progressSegments.forEach((segment, index) => {
    const progressFill = segment.querySelector('.progress-fill');
    if (index < imageIndex) {
      // Fill completed segments
      progressFill.style.width = '100%';
    } else {
      // Reset future segments
      progressFill.style.width = '0%';
    }
  });
  
  // Update current image
  storyCurrentImageIndex = imageIndex;
  changeImageWithDissolve(currentStoryImages[imageIndex]);
  
  // Resume progression from this point
  setTimeout(() => {
    progressToNextImage();
  }, 600); // Wait for dissolve transition to complete
}

window.jumpToImage = jumpToImage;

function fillProgressSegment(segmentIndex, callback) {
  const progressSegment = document.querySelector(`[data-segment="${segmentIndex}"]`);
  if (!progressSegment) {
    console.error('❌ Progress segment not found for index:', segmentIndex);
    return;
  }
  
  const progressFill = progressSegment.querySelector('.progress-fill');
  if (!progressFill) {
    console.error('❌ Progress fill not found for segment:', segmentIndex);
    return;
  }
  
  // Cancel any existing animation before starting new one
  if (window.storyAnimationId) {
    cancelAnimationFrame(window.storyAnimationId);
  }
  
  console.log('⏱️ Starting 5-second timer for segment:', segmentIndex);
  const duration = 5000; // 5 seconds
  const startTime = Date.now();

  const updateProgress = () => {
    if (isStoryPaused) {
      window.storyAnimationId = requestAnimationFrame(updateProgress);
      return;
    }
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    progressFill.style.width = `${progress * 100}%`;

    if (progress < 1) {
      window.storyAnimationId = requestAnimationFrame(updateProgress);
    } else {
      console.log('✅ Progress segment', segmentIndex, 'completed after', elapsed, 'ms');
      window.storyAnimationId = null;
      callback();
    }
  };

  window.storyAnimationId = requestAnimationFrame(updateProgress);
}

function showCTAOverlay(project) {
  const ctaOverlay = document.querySelector('.story-cta-overlay');
  const ctaTitle = ctaOverlay.querySelector('h3');
  const ctaDescription = ctaOverlay.querySelector('p');
  const primaryButton = ctaOverlay.querySelector('.cta-button.primary');

  // Update CTA content
  ctaTitle.textContent = `Interested in ${project.title}?`;
  ctaDescription.textContent = "Let's discuss how I can help bring your vision to life.";

  // Show CTA overlay
  ctaOverlay.style.display = 'flex';

  // Add click handler for primary CTA button
  primaryButton.onclick = () => {
    exitFullscreenView();
    // Scroll to contact section
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
}

// Toggle project details panel
function toggleProjectDetails() {
  const collapsedState = document.getElementById('detailsCollapsed');
  const expandedState = document.getElementById('detailsExpanded');
  
  if (expandedState.style.display === 'none') {
    // Expand details
    collapsedState.style.display = 'none';
    expandedState.style.display = 'block';
    expandedState.style.animation = 'slideUpFade 0.3s ease forwards';
  } else {
    // Collapse details
    expandedState.style.display = 'none';
    collapsedState.style.display = 'flex';
    collapsedState.style.animation = 'slideUpFade 0.3s ease forwards';
  }
}

window.toggleProjectDetails = toggleProjectDetails;

// Dismiss CTA and resume portfolio viewing
function dismissCTAAndResume() {
  const ctaOverlay = document.querySelector('.story-cta-overlay');
  const projectDetailsPanel = document.querySelector('.project-details-panel');
  
  // Hide CTA overlay
  ctaOverlay.style.display = 'none';
  
  // Show project details panel prominently
  projectDetailsPanel.style.transform = 'translateY(0)';
  projectDetailsPanel.style.opacity = '1';
  
  // Add a subtle animation to draw attention
  projectDetailsPanel.style.animation = 'slideUpFade 0.5s ease forwards';
}

window.dismissCTAAndResume = dismissCTAAndResume;

// Change fullscreen project (navigation)
function changeFullscreenProject(direction) {
  const totalProjects = enhancedPortfolioData.length;
  currentFullscreenProject += direction;
  
  // Loop around
  if (currentFullscreenProject >= totalProjects) {
    currentFullscreenProject = 0;
  } else if (currentFullscreenProject < 0) {
    currentFullscreenProject = totalProjects - 1;
  }
  
  updateFullscreenProject(currentFullscreenProject);
}

// Update fullscreen view with project data
function updateFullscreenProject(projectIndex) {
  const project = enhancedPortfolioData[projectIndex];
  if (!project) return;
  
  // Update background image
  const bgImage = document.getElementById('fullscreenImage');
  bgImage.src = project.image;
  bgImage.alt = project.title;
  
  // Update project information
  document.getElementById('projectType').textContent = project.category;
  document.getElementById('clientName').textContent = project.client;
  document.getElementById('projectTitle').textContent = project.title;
  document.getElementById('projectDescription').textContent = project.details;
  document.getElementById('projectYear').textContent = '2024'; // Could be from project data
  document.getElementById('projectTimeline').textContent = project.timeline;
  
  // Update services tags
  const servicesContainer = document.querySelector('.services-tags');
  servicesContainer.innerHTML = project.services.map(service => 
    `<span class="service-tag">${service}</span>`
  ).join('');
  
  // Update view details button
  const viewDetailsBtn = document.getElementById('viewDetailsBtn');
  viewDetailsBtn.setAttribute('onclick', `openPortfolioModal('${project.id}')`);
  
  // Update indicators
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    if (index === projectIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
  
  // Add click handlers to indicators
  indicators.forEach((indicator, index) => {
    indicator.onclick = () => {
      currentFullscreenProject = index;
      updateFullscreenProject(index);
    };
  });
  
  // Track fullscreen view
  if (typeof gtag !== 'undefined') {
    gtag('event', 'portfolio_fullscreen_view', {
      project_id: project.id,
      project_title: project.title
    });
  }
}

// Initialize fullscreen functionality
function initFullscreenPortfolio() {
  // Set up keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isFullscreenActive) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        changeFullscreenProject(-1);
        break;
      case 'ArrowRight':
        changeFullscreenProject(1);
        break;
      case 'Escape':
        exitFullscreenView();
        break;
    }
  });
  
  // Set up indicator click handlers
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentFullscreenProject = index;
      updateFullscreenProject(index);
    });
  });
  
  console.log('✅ Fullscreen portfolio initialized');
}

// Initialize all portfolio page features
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioPage();
  initScrollAnimations();
  initPortfolioSearch();
  initLazyLoading();
  initFullscreenPortfolio();
});

// All functions have been exported individually above their definitions
