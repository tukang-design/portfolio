# Google Analytics Setup Instructions

## 1. Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Create a new account or use existing one
5. Create a property for your website
6. Choose "Web" as the platform
7. Enter your website details:
   - Website name: "Tukang Design Portfolio"
   - Website URL: https://tukang.design (or your domain)
   - Industry category: "Professional Services"
   - Reporting time zone: Choose your timezone

## 2. Get Your Measurement ID

1. After creating the property, you'll see a "Measurement ID" that looks like: `G-XXXXXXXXXX`
2. Copy this ID

## 3. Update Your Website

1. Open `index.html`
2. Find the line: `<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>`
3. Replace `GA_MEASUREMENT_ID` with your actual Measurement ID (e.g., `G-XXXXXXXXXX`)
4. Find the line: `gtag('config', 'GA_MEASUREMENT_ID');`
5. Replace `GA_MEASUREMENT_ID` with your actual Measurement ID

## 4. Example Configuration

Replace these lines in `index.html`:

```html
<!-- Before -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- After (with your real ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 5. Deploy and Test

1. Save your changes
2. Deploy to production: `git add . && git commit -m "Add Google Analytics" && git push origin main`
3. Visit your website and check Google Analytics Real-time reports to see if tracking is working

## 6. Enhanced Tracking Features

Your portfolio now tracks:

### Engagement Metrics
- **Scroll Depth**: Tracks when users scroll 25%, 50%, 75%, and 90% of the page
- **Time on Page**: Tracks engagement milestones at 30s, 1min, 2min, and 5min
- **Portfolio Views**: When users view different portfolio projects
- **Image Interactions**: When users view different portfolio images

### Lead Generation
- **Contact Form Events**: 
  - Form submission attempts
  - Successful email sends
  - Failed submissions
- **Service Interest**: Tracks which services users are interested in
- **WhatsApp Clicks**: If you add WhatsApp buttons

### Portfolio Engagement
- **Project Views**: Which portfolio projects get the most attention
- **Image Engagement**: How users interact with portfolio galleries
- **Auto-transition Tracking**: User engagement with image transitions

## 7. Viewing Your Data

In Google Analytics, you can find:

1. **Real-time reports**: See current visitors
2. **Engagement reports**: Time on page, scroll depth
3. **Events**: All the custom tracking we've set up
4. **Conversions**: Set up goals for contact form submissions

## 8. Setting Up Conversions

1. In GA4, go to "Configure" > "Events"
2. Click "Create event"
3. Name it "contact_form_success"
4. Set up conditions:
   - Event name equals "email_submission_success"
5. Mark as conversion
6. This will track successful contact form submissions as conversions

## 9. Privacy Considerations

- The tracking respects user privacy
- No personal information is sent to analytics
- Only interaction events and engagement metrics are tracked
- Users can disable tracking through browser settings

## Need Help?

If you need help setting this up or want to add more tracking features, let me know!
