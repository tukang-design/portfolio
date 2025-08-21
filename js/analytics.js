// Google Analytics Enhanced Configuration
// GA4 Measurement ID: G-4B77H7TRLM

// Enhanced analytics tracking for portfolio interactions
class AnalyticsTracker {
    constructor() {
        this.isGALoaded = false;
        this.checkGALoaded();
    }

    checkGALoaded() {
        if (typeof gtag !== 'undefined') {
            this.isGALoaded = true;
        } else {
            setTimeout(() => this.checkGALoaded(), 100);
        }
    }

    // Track portfolio project views
    trackPortfolioView(projectTitle, projectId) {
        if (this.isGALoaded) {
            gtag('event', 'portfolio_view', {
                event_category: 'Portfolio',
                event_label: projectTitle,
                project_id: projectId,
                custom_parameter_1: 'portfolio_interaction'
            });
        }
    }

    // Track contact form interactions
    trackContactFormEvent(action, formType = 'main_contact') {
        if (this.isGALoaded) {
            gtag('event', action, {
                event_category: 'Contact Form',
                event_label: formType,
                custom_parameter_1: 'lead_generation'
            });
        }
    }

    // Track service interest
    trackServiceInterest(serviceName) {
        if (this.isGALoaded) {
            gtag('event', 'service_interest', {
                event_category: 'Services',
                event_label: serviceName,
                custom_parameter_1: 'service_inquiry'
            });
        }
    }

    // Track portfolio image transitions
    trackPortfolioImageView(projectTitle, imageIndex) {
        if (this.isGALoaded) {
            gtag('event', 'portfolio_image_view', {
                event_category: 'Portfolio Engagement',
                event_label: `${projectTitle} - Image ${imageIndex + 1}`,
                image_index: imageIndex,
                custom_parameter_1: 'portfolio_engagement'
            });
        }
    }

    // Track WhatsApp clicks
    trackWhatsAppClick() {
        if (this.isGALoaded) {
            gtag('event', 'whatsapp_click', {
                event_category: 'Contact',
                event_label: 'WhatsApp Button',
                custom_parameter_1: 'instant_contact'
            });
        }
    }

    // Track email form submissions
    trackEmailSubmission(success = true) {
        if (this.isGALoaded) {
            gtag('event', success ? 'email_submission_success' : 'email_submission_error', {
                event_category: 'Contact Form',
                event_label: success ? 'Email Sent Successfully' : 'Email Send Failed',
                custom_parameter_1: 'lead_conversion'
            });
        }
    }

    // Track page scroll depth
    trackScrollDepth(percentage) {
        if (this.isGALoaded && percentage >= 75) {
            gtag('event', 'scroll_depth', {
                event_category: 'Engagement',
                event_label: `${percentage}% scrolled`,
                scroll_percentage: percentage,
                custom_parameter_1: 'page_engagement'
            });
        }
    }

    // Track time on page milestones
    trackTimeOnPage(seconds) {
        if (this.isGALoaded && [30, 60, 120, 300].includes(seconds)) {
            gtag('event', 'time_on_page', {
                event_category: 'Engagement',
                event_label: `${seconds} seconds`,
                time_seconds: seconds,
                custom_parameter_1: 'page_engagement'
            });
        }
    }
}

// Initialize analytics tracker
const analytics = new AnalyticsTracker();

// Scroll depth tracking
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrolled = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrolled > maxScroll) {
        maxScroll = scrolled;
        if ([25, 50, 75, 90].includes(scrolled)) {
            analytics.trackScrollDepth(scrolled);
        }
    }
});

// Time on page tracking
let timeOnPage = 0;
setInterval(() => {
    timeOnPage += 10;
    if ([30, 60, 120, 300].includes(timeOnPage)) {
        analytics.trackTimeOnPage(timeOnPage);
    }
}, 10000);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = analytics;
} else {
    window.analytics = analytics;
}
