// Smooth Scroll Snap Enhancement
// Improves the native CSS scroll snap with custom controls and smooth transitions

class SmoothScrollManager {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.wheelAccumulator = 0;
        this.wheelThreshold = 100;
        
        this.init();
    }

    init() {
        this.setupSections();
        this.bindEvents();
        this.updateActiveNavigation();
        
        console.log('✨ Smooth scroll snap initialized with', this.sections.length, 'sections');
    }

    setupSections() {
        // Get all main sections
        const sectionSelectors = [
            '#home',
            '#services', 
            '#work',
            '#problems',
            '#contact'
        ];

        this.sections = sectionSelectors.map(selector => {
            const element = document.querySelector(selector);
            if (element) {
                return {
                    element,
                    id: selector.replace('#', ''),
                    offsetTop: element.offsetTop
                };
            }
            return null;
        }).filter(Boolean);

        // Update offset positions on resize
        window.addEventListener('resize', () => {
            this.updateSectionOffsets();
        });
    }

    updateSectionOffsets() {
        this.sections.forEach(section => {
            section.offsetTop = section.element.offsetTop;
        });
    }

    bindEvents() {
        // Enhanced wheel scrolling for better control
        document.addEventListener('wheel', (e) => {
            this.handleWheelScroll(e);
        }, { passive: false });

        // Track scroll position for navigation updates
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
            this.handleScrollEnd();
            this.hideScrollHint();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Navigation link clicks
        this.setupNavigationLinks();
    }

    hideScrollHint() {
        // Hide scroll hint after first scroll
        if (window.scrollY > 100) {
            document.body.classList.add('scrolled');
        }
    }

    handleWheelScroll(e) {
        // Only handle wheel scrolling if not already scrolling
        if (this.isScrolling) {
            e.preventDefault();
            return;
        }

        // Accumulate wheel delta for better control
        this.wheelAccumulator += Math.abs(e.deltaY);

        if (this.wheelAccumulator >= this.wheelThreshold) {
            e.preventDefault();
            
            const direction = e.deltaY > 0 ? 1 : -1;
            this.navigateToSection(this.currentSection + direction);
            
            this.wheelAccumulator = 0;
        }

        // Clear accumulator after a delay
        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(() => {
            this.wheelAccumulator = 0;
        }, 150);
    }

    handleKeyboardNavigation(e) {
        if (this.isScrolling) return;

        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                this.navigateToSection(this.currentSection + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.navigateToSection(this.currentSection - 1);
                break;
            case 'Home':
                e.preventDefault();
                this.navigateToSection(0);
                break;
            case 'End':
                e.preventDefault();
                this.navigateToSection(this.sections.length - 1);
                break;
        }
    }

    navigateToSection(targetIndex) {
        // Bounds checking
        if (targetIndex < 0 || targetIndex >= this.sections.length) {
            return;
        }

        if (targetIndex === this.currentSection) {
            return;
        }

        this.isScrolling = true;
        this.currentSection = targetIndex;

        const targetSection = this.sections[targetIndex];
        
        // Smooth scroll to section
        targetSection.element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Track analytics for section navigation
        if (typeof analytics !== 'undefined') {
            analytics.trackScrollDepth(Math.round((targetIndex / (this.sections.length - 1)) * 100));
        }

        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);

        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // Find current section based on scroll position
        let newCurrentSection = 0;
        
        for (let i = 0; i < this.sections.length; i++) {
            const section = this.sections[i];
            const nextSection = this.sections[i + 1];
            
            if (scrollPosition >= section.offsetTop) {
                if (!nextSection || scrollPosition < nextSection.offsetTop) {
                    newCurrentSection = i;
                    break;
                }
                newCurrentSection = i;
            }
        }

        // Update current section if it changed
        if (newCurrentSection !== this.currentSection && !this.isScrolling) {
            this.currentSection = newCurrentSection;
        }

        // Update navigation active states
        this.updateNavigationStates();
    }

    updateNavigationStates() {
        // Update navigation dots or active states
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.replace('#', '');
                const isActive = this.sections[this.currentSection]?.id === sectionId;
                
                link.classList.toggle('active', isActive);
            }
        });

        // Update any custom navigation indicators
        this.updateScrollIndicator();
    }

    updateScrollIndicator() {
        // Create or update a scroll progress indicator
        let indicator = document.querySelector('.scroll-progress');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'scroll-progress';
            indicator.innerHTML = `
                <div class="scroll-progress-track">
                    <div class="scroll-progress-thumb"></div>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .scroll-progress {
                    position: fixed;
                    right: 2rem;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 1000;
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }
                
                .scroll-progress:hover {
                    opacity: 1;
                }
                
                .scroll-progress-track {
                    width: 4px;
                    height: 200px;
                    background: hsla(var(--muted-foreground), 0.3);
                    border-radius: 2px;
                    position: relative;
                }
                
                .scroll-progress-thumb {
                    width: 100%;
                    height: ${100 / this.sections.length}%;
                    background: hsl(var(--neon-green));
                    border-radius: 2px;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 0 10px hsla(var(--neon-green), 0.5);
                }
                
                @media (max-width: 768px) {
                    .scroll-progress {
                        display: none;
                    }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(indicator);
        }

        // Update thumb position
        const thumb = indicator.querySelector('.scroll-progress-thumb');
        if (thumb) {
            const progress = (this.currentSection / (this.sections.length - 1)) * (100 - (100 / this.sections.length));
            thumb.style.transform = `translateY(${progress * 2}px)`;
        }
    }

    setupNavigationLinks() {
        // Enhanced navigation for existing nav links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const targetId = href.replace('#', '');
                
                // Find target section index
                const targetIndex = this.sections.findIndex(section => section.id === targetId);
                
                if (targetIndex !== -1) {
                    e.preventDefault();
                    this.navigateToSection(targetIndex);
                }
            });
        });
    }

    handleScrollEnd() {
        clearTimeout(this.scrollEndTimeout);
        this.scrollEndTimeout = setTimeout(() => {
            // Snap to nearest section if close enough
            this.snapToNearestSection();
        }, 150);
    }

    snapToNearestSection() {
        if (this.isScrolling) return;

        const scrollPosition = window.scrollY;
        let closestSection = 0;
        let closestDistance = Infinity;

        this.sections.forEach((section, index) => {
            const distance = Math.abs(scrollPosition - section.offsetTop);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = index;
            }
        });

        // If we're close enough to a section, snap to it
        const snapThreshold = window.innerHeight * 0.1; // 10% of viewport height
        
        if (closestDistance < snapThreshold && closestSection !== this.currentSection) {
            this.navigateToSection(closestSection);
        }
    }

    // Public methods for external control
    goToSection(sectionId) {
        const targetIndex = this.sections.findIndex(section => section.id === sectionId);
        if (targetIndex !== -1) {
            this.navigateToSection(targetIndex);
        }
    }

    nextSection() {
        this.navigateToSection(this.currentSection + 1);
    }

    previousSection() {
        this.navigateToSection(this.currentSection - 1);
    }

    getCurrentSection() {
        return this.sections[this.currentSection];
    }
}

// Initialize smooth scroll manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.smoothScrollManager = new SmoothScrollManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothScrollManager;
} else {
    window.SmoothScrollManager = SmoothScrollManager;
}
