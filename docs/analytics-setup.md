# Google Analytics Setup - Portfolio

## Configuration Details
- **GA4 Measurement ID**: G-4B77H7TRLM
- **Implementation Date**: August 21, 2025
- **Property Name**: Tukang Design Portfolio

## Tracking Events Implemented

### 📊 Portfolio Interactions
- **Portfolio Project Views**: Tracks when users view specific portfolio projects
- **Portfolio Image Views**: Tracks individual image views within projects
- **Auto-transition Tracking**: Monitors automatic image transitions

### 📧 Contact Form Analytics
- **Form Submission Attempts**: Tracks when users start form submission
- **Service Interest**: Tracks which services users are interested in
- **Email Submission Success/Failure**: Monitors EmailJS integration performance
- **Form Validation Errors**: Tracks form field validation issues

### 📱 User Engagement
- **Scroll Depth**: Tracks user scroll behavior (25%, 50%, 75%, 90%)
- **Time on Page**: Monitors user engagement duration (30s, 60s, 120s, 300s)
- **WhatsApp Clicks**: Tracks instant contact attempts

## Custom Events Overview

### Event Categories:
1. **Portfolio** - Project and image interactions
2. **Contact Form** - All form-related activities
3. **Services** - Service interest tracking
4. **Portfolio Engagement** - Detailed portfolio interactions
5. **Contact** - Direct contact methods (WhatsApp)
6. **Engagement** - General user engagement metrics

## Implementation Files:
- `index.html` - Main GA4 tracking code
- `js/analytics.js` - Enhanced tracking implementation
- `js/portfolio.js` - Portfolio interaction tracking
- `js/contact.js` - Contact form tracking

## Analytics Dashboard Recommendations

### Key Metrics to Monitor:
1. **Most Viewed Portfolio Projects**
2. **Contact Form Conversion Rate**
3. **Service Interest Distribution**
4. **User Engagement Depth**
5. **Mobile vs Desktop Behavior**
6. **Email Delivery Success Rate**

### Custom Reports:
- Portfolio project performance
- Contact form funnel analysis
- Service inquiry trends
- User engagement patterns

## Event Tracking Structure

```javascript
// Example custom events sent to GA4:
gtag('event', 'portfolio_view', {
  event_category: 'Portfolio',
  event_label: 'Project Name',
  project_id: 'project_id'
});

gtag('event', 'email_submission_success', {
  event_category: 'Contact Form',
  event_label: 'Email Sent Successfully'
});
```

## Performance Considerations
- Analytics script loads asynchronously
- Event tracking has built-in availability checks
- Minimal impact on page load performance
- Graceful degradation if GA4 is blocked

## Privacy & Compliance
- Using standard GA4 implementation
- No personally identifiable information (PII) tracked
- Respects user privacy settings
- Compatible with cookie consent requirements
