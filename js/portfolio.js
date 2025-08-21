// Portfolio functionality - Performance Optimized

// Performance tracking and image caching
const performanceTracker = {
    imageCache: new Map(),
    preloadPromises: new Map(),
    imagesPreloaded: false
};

// Optimized image preloading
function preloadImage(src) {
    if (performanceTracker.imageCache.has(src)) {
        return Promise.resolve(performanceTracker.imageCache.get(src));
    }
    
    if (performanceTracker.preloadPromises.has(src)) {
        return performanceTracker.preloadPromises.get(src);
    }
    
    const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            performanceTracker.imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.loading = 'lazy'; // Enable lazy loading
        img.decoding = 'async'; // Enable async decoding
        img.src = src;
    });
    
    performanceTracker.preloadPromises.set(src, promise);
    return promise;
}

// Static portfolio data (fallback for when Supabase is not available)
const portfolioData = [
  {
    id: '1',
    title: 'Kapitani: Farm Management App',
    category: 'UI Revamp & Design System Library',
    description: 'A complete UI and UX revamp of the Kapitani farm management app. The project included a new design system and integrated a myGAP pre-application process, streamlining farm task activities for an enhanced user experience.',
    details: 'A complete UI and UX revamp of the Kapitani farm management app. The project included a new design system and integrated a myGAP pre-application process, streamlining farm task activities for an enhanced user experience.',
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
    client: 'Kapitani'
  },
  {
    id: '2',
    title: 'Raisuri: Junior Football Academy Club',
    category: 'Logo Redesign & Brand Expansion',
    description: 'A total reimagining of the Raisuri Junior Football Academy\'s brand. The new logo is a modern, flexible, and scalable design that ensures brand consistency across all touchpoints, giving the club a young and passionate feel.',
    details: 'A total reimagining of the Raisuri Junior Football Academy\'s brand. The new logo is a modern, flexible, and scalable design that ensures brand consistency across all touchpoints, giving the club a young and passionate feel.',
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
    client: 'Raisuri'
  },
  {
    id: '3',
    title: 'SAG Logistics: Local Logistics Solution Provider',
    category: 'Corporate Brand Refresh & Web Development',
    description: 'A brand identity refresh for SA Global Logistics, starting with a new company profile design. This visual style was then expanded to a new website, ensuring a modern and cohesive brand presence across all digital platforms.',
    details: 'A brand identity refresh for SA Global Logistics, starting with a new company profile design. This visual style was then expanded to a new website, ensuring a modern and cohesive brand presence across all digital platforms.',
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
    client: 'SA Global Logistics'
  },
  {
    id: '4',
    title: 'Youthopia: Junior Edu-tech Company',
    category: 'Logo Design & Brand Identity',
    description: 'Designed a comprehensive brand identity and logo for a new edu-tech platform for kids. The visual identity targets both young students and their parents, with a design that is both playful and trustworthy.',
    details: 'Designed a comprehensive brand identity and logo for a new edu-tech platform for kids. The visual identity targets both young students and their parents, with a design that is both playful and trustworthy.',
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
    client: 'Youthopia'
  }
];

// Portfolio rendering function
function renderPortfolio(items = portfolioData) {
  const portfolioGrid = document.getElementById('portfolioGrid');
  if (!portfolioGrid) return;

  if (items.length === 0) {
    portfolioGrid.innerHTML = `
      <div class="portfolio-loading">
        <p>No portfolio items available at the moment.</p>
      </div>
    `;
    return;
  }

  const portfolioHTML = items.map(item => `
    <div class="portfolio-item" onclick="openPortfolioDetails('${item.id}')">
      <div class="portfolio-image-container">
        <img 
          src="${item.image}" 
          alt="${item.title}"
          class="portfolio-image"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
        >
        <div class="portfolio-image-placeholder" style="display: none;">
          <span>Image not available</span>
        </div>
        <div class="portfolio-overlay">
          <div class="portfolio-overlay-text">View Project Details</div>
        </div>
      </div>
      
      <div class="portfolio-content">
        <div class="portfolio-meta">
          <span class="portfolio-category">${item.category}</span>
        </div>
        
        <h3 class="portfolio-title">${item.title}</h3>
        <p class="portfolio-description">${item.description}</p>
        <p class="portfolio-details">${item.details}</p>
        
        <div class="portfolio-link" onclick="event.stopPropagation(); openPortfolioDetails('${item.id}')">
          <span>View full project</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17l9.2-9.2M17 17V7H7"/>
          </svg>
        </div>
      </div>
    </div>
  `).join('');

  portfolioGrid.innerHTML = portfolioHTML;
}

// Load portfolio on page load
document.addEventListener('DOMContentLoaded', () => {
  // Performance: Preload critical portfolio images
  const criticalImages = portfolioData.slice(0, 2).flatMap(project => project.images || [project.image]);
  Promise.all(criticalImages.map(preloadImage))
    .then(() => console.log('🚀 Critical portfolio images preloaded'))
    .catch(err => console.warn('Image preload warning:', err));
  
  // Try to load from Supabase first, fallback to static data
  loadPortfolioData();
  initInteractivePortfolio();
});

// Additional initialization on window load for better browser compatibility
window.addEventListener('load', () => {
  setTimeout(() => {
    // Double-check that portfolio is initialized
    const mainImg = document.querySelector('#portfolioMainImage img');
    if (!mainImg || !mainImg.src || mainImg.src === '') {
      console.log('Window load: Re-initializing portfolio');
      initInteractivePortfolio();
    }
  }, 300);
});

async function loadPortfolioData() {
  try {
    // If we have Supabase available, we could fetch from there
    // For now, we'll use the static data
    renderPortfolio(portfolioData);
    
    // Preload remaining images after initial render
    requestIdleCallback(() => {
      const remainingImages = portfolioData.slice(2).flatMap(project => project.images || [project.image]);
      Promise.all(remainingImages.map(preloadImage))
        .then(() => {
          performanceTracker.imagesPreloaded = true;
          console.log('📸 All portfolio images preloaded');
        });
    });
  } catch (error) {
    console.error('Error loading portfolio:', error);
    renderPortfolio(portfolioData);
  }
}

// Interactive Portfolio System
let currentProjectIndex = 0;
let currentImageIndex = 0;
let autoTransitionInterval = null;
let autoTransitionTimeout = null;
const AUTO_TRANSITION_DELAY = 4000; // 4 seconds per image
const PROJECT_TRANSITION_DELAY = 6000; // 6 seconds before moving to next project (longer pause)

function initInteractivePortfolio() {
  renderPortfolioDisplay(portfolioData[currentProjectIndex]);
  setupNavigationControls();
  startAutoTransition();
}

function renderPortfolioDisplay(project) {
  const mainImage = document.getElementById('portfolioMainImage');
  const thumbnails = document.getElementById('portfolioThumbnails');
  const projectInfo = document.getElementById('portfolioProjectInfo');
  
  if (!mainImage || !thumbnails || !projectInfo) return;

  const images = project.images || [project.image];
  currentImageIndex = 0;
  
  // Set main image
  const mainImageElement = mainImage.querySelector('img');
  if (mainImageElement) {
    mainImageElement.src = images[0];
    mainImageElement.alt = project.title;
  }
  
  // Render thumbnails with progress bars
  if (images.length > 1) {
    thumbnails.innerHTML = images.map((img, index) => `
      <div class="portfolio-thumbnail-auto ${index === 0 ? 'active' : ''}" 
           onclick="selectImage(${index})" 
           data-index="${index}">
        <img src="${img}" alt="${project.title} - Image ${index + 1}">
        <div class="portfolio-thumbnail-progress" style="width: ${index === 0 ? '0%' : '0%'}"></div>
      </div>
    `).join('');
    
    thumbnails.style.display = 'flex';
    startAutoTransition();
  } else {
    thumbnails.style.display = 'none';
    stopAutoTransition();
  }
  
  // Render project info with all details
  projectInfo.innerHTML = `
    <h3 class="portfolio-project-title">${project.title}</h3>
    <div class="portfolio-project-category">${project.category}</div>
    <p class="portfolio-project-details-text">${project.details}</p>
    
    <div class="portfolio-project-details">
      <div class="portfolio-detail-item">
        <div class="portfolio-detail-label">Client</div>
        <div class="portfolio-detail-value">${project.client}</div>
      </div>
      
      <div class="portfolio-detail-item">
        <div class="portfolio-detail-label">Timeline</div>
        <div class="portfolio-detail-value">${project.timeline}</div>
      </div>
      
      <div class="portfolio-detail-item">
        <div class="portfolio-detail-label">Services</div>
        <div class="portfolio-detail-value">${project.services.join(', ')}</div>
      </div>
    </div>
  `;
}

function selectImage(index) {
  const project = portfolioData[currentProjectIndex];
  const images = project.images || [project.image];
  
  if (index === currentImageIndex || index >= images.length) return;
  
  currentImageIndex = index;
  
  // Track portfolio image view
  if (typeof analytics !== 'undefined') {
    analytics.trackPortfolioImageView(project.title, index);
  }
  
  // Update main image
  const mainImageElement = document.querySelector('#portfolioMainImage img');
  if (mainImageElement) {
    mainImageElement.style.opacity = '0.5';
    setTimeout(() => {
      mainImageElement.src = images[index];
      mainImageElement.alt = `${project.title} - Portfolio project image ${index + 1} of ${images.length}`;
      mainImageElement.style.opacity = '1';
    }, 150);
  }
  
  // Update active thumbnail
  const thumbnails = document.querySelectorAll('.portfolio-thumbnail-auto');
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
    // Reset progress bar for non-active thumbnails
    const progressBar = thumb.querySelector('.portfolio-thumbnail-progress');
    if (progressBar) {
      progressBar.style.width = i === index ? '0%' : '0%';
    }
  });
  
  // Restart auto transition
  startAutoTransition();
}

function startAutoTransition() {
  stopAutoTransition();
  
  const project = portfolioData[currentProjectIndex];
  const images = project.images || [project.image];
  
  if (images.length <= 1) return;
  
  const activeProgress = document.querySelector('.portfolio-thumbnail-auto.active .portfolio-thumbnail-progress');
  
  if (activeProgress) {
    // Check if this is the last image (use longer delay for project transition)
    const isLastImage = currentImageIndex === images.length - 1;
    const transitionDelay = isLastImage ? PROJECT_TRANSITION_DELAY : AUTO_TRANSITION_DELAY;
    
    // Animate progress bar
    activeProgress.style.width = '0%';
    activeProgress.style.transition = `width ${transitionDelay}ms linear`;
    
    setTimeout(() => {
      activeProgress.style.width = '100%';
    }, 50);
    
    // Set timeout to switch to next image or project
    autoTransitionTimeout = setTimeout(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      
      // Check if we've completed all images in current project
      if (nextIndex === 0 && currentImageIndex === images.length - 1) {
        // All images have been shown, move to next project
        const nextProjectIndex = (currentProjectIndex + 1) % portfolioData.length;
        selectProject(nextProjectIndex, true); // Pass true to indicate auto transition
      } else {
        // Continue with next image in current project
        selectImage(nextIndex);
      }
    }, transitionDelay);
  }
}

function stopAutoTransition() {
  if (autoTransitionTimeout) {
    clearTimeout(autoTransitionTimeout);
    autoTransitionTimeout = null;
  }
  
  // Reset all progress bars
  const progressBars = document.querySelectorAll('.portfolio-thumbnail-progress');
  progressBars.forEach(bar => {
    bar.style.width = '0%';
    bar.style.transition = 'width 0.1s linear';
  });
}

function selectProject(index, isAutoTransition = false) {
  if (index === currentProjectIndex) return;
  
  currentProjectIndex = index;
  currentImageIndex = 0;
  
  // Track portfolio project view
  if (typeof analytics !== 'undefined') {
    const project = portfolioData[index];
    analytics.trackPortfolioView(project.title, project.id);
  }
  
  // Stop current auto transition
  stopAutoTransition();
  
  // Add smooth transition effect for auto transitions
  if (isAutoTransition) {
    const portfolioSection = document.querySelector('.portfolio-image-section');
    if (portfolioSection) {
      portfolioSection.style.opacity = '0.7';
      portfolioSection.style.transform = 'scale(0.98)';
      portfolioSection.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        // Render new project
        renderPortfolioDisplay(portfolioData[currentProjectIndex]);
        updateNavigationButtons();
        
        // Reset and animate back
        setTimeout(() => {
          portfolioSection.style.opacity = '1';
          portfolioSection.style.transform = 'scale(1)';
          
          // Reset styles after animation
          setTimeout(() => {
            portfolioSection.style.transition = '';
          }, 300);
        }, 50);
      }, 150);
    } else {
      // Fallback if section not found
      renderPortfolioDisplay(portfolioData[currentProjectIndex]);
      updateNavigationButtons();
    }
  } else {
    // Immediate transition for manual navigation
    renderPortfolioDisplay(portfolioData[currentProjectIndex]);
    updateNavigationButtons();
  }
}

function setupNavigationControls() {
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = currentProjectIndex > 0 ? currentProjectIndex - 1 : portfolioData.length - 1;
      selectProject(newIndex);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = currentProjectIndex < portfolioData.length - 1 ? currentProjectIndex + 1 : 0;
      selectProject(newIndex);
    });
  }
  
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  
  // Enable/disable buttons based on current position
  if (prevBtn) {
    prevBtn.disabled = false; // Always enabled for circular navigation
  }
  
  if (nextBtn) {
    nextBtn.disabled = false; // Always enabled for circular navigation
  }
}

// Make functions globally available
window.selectProject = selectProject;
window.selectImage = selectImage;
window.initInteractivePortfolio = initInteractivePortfolio;

// Add event listeners for pausing auto-transition on user interaction
document.addEventListener('DOMContentLoaded', () => {
  // Pause auto-transition when user hovers over thumbnails
  document.addEventListener('mouseenter', (e) => {
    if (e.target && e.target.closest && e.target.closest('.portfolio-thumbnail-auto')) {
      stopAutoTransition();
    }
  }, true);
  
  // Resume auto-transition when user stops hovering
  document.addEventListener('mouseleave', (e) => {
    if (e.target && e.target.closest && e.target.closest('.portfolio-thumbnails-auto')) {
      startAutoTransition();
    }
  }, true);
  
  // Pause on focus (for keyboard navigation)
  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.closest && e.target.closest('.portfolio-thumbnail-auto')) {
      stopAutoTransition();
    }
  }, true);
  
  // Resume when focus leaves
  document.addEventListener('focusout', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest('.portfolio-thumbnails-auto')) {
      startAutoTransition();
    }
  }, true);
});

// Add portfolio modal styles
const portfolioStyles = `
<style>
.portfolio-modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.portfolio-modal-image img {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

.portfolio-modal-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.portfolio-timeline {
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.portfolio-services {
  margin: 1.5rem 0;
}

.portfolio-services h5 {
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.portfolio-services ul {
  list-style: none;
  padding: 0;
}

.portfolio-services li {
  padding: 0.25rem 0;
  color: hsl(var(--muted-foreground));
}

.portfolio-services li:before {
  content: '•';
  color: hsl(var(--neon-green));
  margin-right: 0.5rem;
}

.portfolio-client {
  margin: 1rem 0;
  color: hsl(var(--muted-foreground));
}

.portfolio-modal-actions {
  margin-top: 2rem;
}

.portfolio-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
}

.portfolio-image-placeholder {
  width: 100%;
  height: 16rem;
  background: hsl(var(--muted));
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
}

.portfolio-overlay {
  position: absolute;
  inset: 0;
  background: hsla(var(--primary), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-smooth);
}

.portfolio-item:hover .portfolio-overlay {
  opacity: 1;
}

.portfolio-overlay-text {
  background: hsla(var(--background), 0.9);
  color: hsl(var(--neon-green));
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .portfolio-modal-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .portfolio-modal-meta {
    gap: 0.5rem;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', portfolioStyles);