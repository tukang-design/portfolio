// Google Analytics Consent Management
// Handles user consent for analytics and advertising tracking

class ConsentManager {
    constructor() {
        this.consentGiven = false;
        this.consentKey = 'ga_consent_status';
        this.init();
    }

    init() {
        // Check if consent was previously given
        const savedConsent = localStorage.getItem(this.consentKey);
        
        if (savedConsent === 'granted') {
            this.consentGiven = true;
            this.updateConsentStatus(true);
        } else if (savedConsent === 'denied') {
            this.consentGiven = false;
            this.updateConsentStatus(false);
        } else {
            // First time visitor - show consent banner
            this.showConsentBanner();
        }
    }

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <div class="consent-text">
                    <h4>🍪 Cookie & Analytics Consent</h4>
                    <p>We use cookies and analytics to improve your experience and understand how you interact with our portfolio. This helps us provide better services and personalized content.</p>
                </div>
                <div class="consent-actions">
                    <button id="consent-accept" class="btn btn-cta">Accept All</button>
                    <button id="consent-essential" class="btn btn-secondary">Essential Only</button>
                    <button id="consent-customize" class="btn btn-link">Customize</button>
                </div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            #consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: hsl(var(--background));
                border-top: 2px solid hsl(var(--neon-green));
                padding: 1rem;
                z-index: 10000;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            }
            
            .consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                gap: 2rem;
                flex-wrap: wrap;
            }
            
            .consent-text {
                flex: 1;
                min-width: 300px;
            }
            
            .consent-text h4 {
                color: hsl(var(--neon-green));
                margin-bottom: 0.5rem;
                font-size: 1.1rem;
            }
            
            .consent-text p {
                color: hsl(var(--muted-foreground));
                font-size: 0.9rem;
                line-height: 1.4;
                margin: 0;
            }
            
            .consent-actions {
                display: flex;
                gap: 1rem;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .consent-actions .btn {
                font-size: 0.9rem;
                padding: 0.5rem 1rem;
                white-space: nowrap;
            }
            
            .btn-link {
                background: none;
                border: none;
                color: hsl(var(--muted-foreground));
                text-decoration: underline;
                cursor: pointer;
                font-size: 0.8rem;
            }
            
            .btn-link:hover {
                color: hsl(var(--foreground));
            }
            
            @media (max-width: 768px) {
                .consent-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
                
                .consent-actions {
                    justify-content: center;
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('consent-accept').addEventListener('click', () => {
            this.grantConsent(true);
            this.hideConsentBanner();
        });

        document.getElementById('consent-essential').addEventListener('click', () => {
            this.grantConsent(false);
            this.hideConsentBanner();
        });

        document.getElementById('consent-customize').addEventListener('click', () => {
            this.showCustomizeModal();
        });
    }

    showCustomizeModal() {
        const modal = document.createElement('div');
        modal.id = 'consent-modal';
        modal.innerHTML = `
            <div class="consent-modal-overlay">
                <div class="consent-modal-content">
                    <h3>Customize Cookie Preferences</h3>
                    <div class="consent-options">
                        <div class="consent-option">
                            <label class="consent-switch">
                                <input type="checkbox" id="essential-cookies" checked disabled>
                                <span class="consent-slider"></span>
                            </label>
                            <div class="consent-option-info">
                                <h4>Essential Cookies</h4>
                                <p>Required for basic website functionality. Cannot be disabled.</p>
                            </div>
                        </div>
                        
                        <div class="consent-option">
                            <label class="consent-switch">
                                <input type="checkbox" id="analytics-cookies" checked>
                                <span class="consent-slider"></span>
                            </label>
                            <div class="consent-option-info">
                                <h4>Analytics Cookies</h4>
                                <p>Help us understand how visitors interact with our portfolio.</p>
                            </div>
                        </div>
                        
                        <div class="consent-option">
                            <label class="consent-switch">
                                <input type="checkbox" id="advertising-cookies" checked>
                                <span class="consent-slider"></span>
                            </label>
                            <div class="consent-option-info">
                                <h4>Advertising & Personalization</h4>
                                <p>Enable personalized content and improved user experience.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="consent-modal-actions">
                        <button id="save-preferences" class="btn btn-cta">Save Preferences</button>
                        <button id="close-modal" class="btn btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            #consent-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .consent-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            
            .consent-modal-content {
                background: hsl(var(--background));
                border: 2px solid hsl(var(--neon-green));
                border-radius: var(--radius);
                padding: 2rem;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .consent-modal-content h3 {
                color: hsl(var(--neon-green));
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .consent-option {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius);
            }
            
            .consent-switch {
                position: relative;
                width: 60px;
                height: 30px;
                flex-shrink: 0;
            }
            
            .consent-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .consent-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 30px;
            }
            
            .consent-slider:before {
                position: absolute;
                content: "";
                height: 22px;
                width: 22px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            input:checked + .consent-slider {
                background-color: hsl(var(--neon-green));
            }
            
            input:checked + .consent-slider:before {
                transform: translateX(30px);
            }
            
            input:disabled + .consent-slider {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .consent-option-info h4 {
                color: hsl(var(--foreground));
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            
            .consent-option-info p {
                color: hsl(var(--muted-foreground));
                font-size: 0.9rem;
                line-height: 1.4;
                margin: 0;
            }
            
            .consent-modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
            }
        `;
        
        document.head.appendChild(modalStyle);
        document.body.appendChild(modal);

        // Add modal event listeners
        document.getElementById('save-preferences').addEventListener('click', () => {
            const analytics = document.getElementById('analytics-cookies').checked;
            const advertising = document.getElementById('advertising-cookies').checked;
            
            this.grantConsent(analytics && advertising);
            this.hideCustomizeModal();
            this.hideConsentBanner();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideCustomizeModal();
        });
    }

    grantConsent(fullConsent = true) {
        this.consentGiven = fullConsent;
        localStorage.setItem(this.consentKey, fullConsent ? 'granted' : 'denied');
        this.updateConsentStatus(fullConsent);
        
        console.log(`🍪 Consent ${fullConsent ? 'granted' : 'limited'} - Analytics tracking ${fullConsent ? 'enabled' : 'restricted'}`);
    }

    updateConsentStatus(granted) {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': granted ? 'granted' : 'denied',
                'ad_storage': granted ? 'granted' : 'denied',
                'ad_user_data': granted ? 'granted' : 'denied',
                'ad_personalization': granted ? 'granted' : 'denied',
                'personalization_storage': granted ? 'granted' : 'denied'
            });
        }
    }

    hideConsentBanner() {
        const banner = document.getElementById('consent-banner');
        if (banner) {
            banner.remove();
        }
    }

    hideCustomizeModal() {
        const modal = document.getElementById('consent-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Public method to check consent status
    hasConsent() {
        return this.consentGiven;
    }

    // Public method to revoke consent
    revokeConsent() {
        this.grantConsent(false);
        console.log('🍪 Consent revoked - Analytics tracking disabled');
    }
}

// Initialize consent manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.consentManager = new ConsentManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsentManager;
} else {
    window.ConsentManager = ConsentManager;
}
