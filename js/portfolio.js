// Portfolio functionality

// Static portfolio data (fallback for when Supabase is not available)
const portfolioData = [
  {
    id: '1',
    title: 'Kapitani International',
    category: 'Brand Design',
    description: 'Complete Brand Identity & Website',
    details: 'Comprehensive brand identity design for an international maritime company, including logo design, brand guidelines, and a professional website that reflects their global presence and expertise.',
    image: 'src/assets/portfolio-kapitani-new.png',
    services: ['Logo Design', 'Brand Guidelines', 'Website Design'],
    timeline: '6 weeks',
    client: 'Kapitani International'
  },
  {
    id: '2',
    title: 'Raisuri Technology',
    category: 'Website Design',
    description: 'Modern Tech Company Website',
    details: 'A sleek, modern website for a technology company specializing in innovative solutions. The design focuses on showcasing their technical expertise while maintaining user-friendly navigation.',
    image: 'src/assets/portfolio-raisuri-new.png',
    services: ['Website Design', 'UI/UX Design', 'Development'],
    timeline: '4 weeks',
    client: 'Raisuri Technology'
  },
  {
    id: '3',
    title: 'SAG Logistics',
    category: 'Brand Design',
    description: 'Logistics Brand Identity',
    details: 'Professional brand identity for a logistics company, emphasizing reliability, efficiency, and global reach. The design system works across all touchpoints from business cards to vehicle branding.',
    image: 'src/assets/portfolio-sag-new.png',
    services: ['Logo Design', 'Brand Identity', 'Print Design'],
    timeline: '5 weeks',
    client: 'SAG Logistics'
  },
  {
    id: '4',
    title: 'Youthopia Event',
    category: 'Event Branding',
    description: 'Youth Event Brand Identity',
    details: 'Vibrant and energetic brand identity for a youth-focused event. The design captures the spirit of creativity and innovation while appealing to a young, dynamic audience.',
    image: 'src/assets/portfolio-youthopia-new.png',
    services: ['Event Branding', 'Marketing Materials', 'Social Media Graphics'],
    timeline: '3 weeks',
    client: 'Youthopia Event'
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

// Portfolio details modal function
function openPortfolioDetails(itemId) {
  const item = portfolioData.find(p => p.id === itemId);
  if (!item) return;

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'portfolioModal';
  
  modal.innerHTML = `
    <div class="modal-content portfolio-modal">
      <div class="modal-header">
        <h3>${item.title}</h3>
        <button class="modal-close" onclick="closePortfolioModal()">&times;</button>
      </div>
      
      <div class="portfolio-modal-content">
        <div class="portfolio-modal-image">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 0.5rem;">
        </div>
        
        <div class="portfolio-modal-info">
          <div class="portfolio-modal-meta">
            <span class="portfolio-category">${item.category}</span>
            ${item.timeline ? `<span class="portfolio-timeline">Timeline: ${item.timeline}</span>` : ''}
          </div>
          
          <h4>${item.description}</h4>
          <p>${item.details}</p>
          
          ${item.services && item.services.length > 0 ? `
            <div class="portfolio-services">
              <h5>Services Provided:</h5>
              <ul>
                ${item.services.map(service => `<li>${service}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${item.client ? `
            <div class="portfolio-client">
              <strong>Client:</strong> ${item.client}
            </div>
          ` : ''}
          
          <div class="portfolio-modal-actions">
            <button class="btn btn-cta" onclick="closePortfolioModal(); openContactForm('Custom Project')">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePortfolioModal();
    }
  });
}

function closePortfolioModal() {
  const modal = document.getElementById('portfolioModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// Load portfolio on page load
document.addEventListener('DOMContentLoaded', () => {
  // Try to load from Supabase first, fallback to static data
  loadPortfolioData();
});

async function loadPortfolioData() {
  try {
    // If we have Supabase available, we could fetch from there
    // For now, we'll use the static data
    renderPortfolio(portfolioData);
  } catch (error) {
    console.error('Error loading portfolio:', error);
    renderPortfolio(portfolioData);
  }
}

// Make functions globally available
window.openPortfolioDetails = openPortfolioDetails;
window.closePortfolioModal = closePortfolioModal;

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