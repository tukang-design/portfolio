# Email Setup for Contact Form

## Current Issue:
The contact form is not sending actual emails because:

1. **Netlify Forms** - Only works when deployed to Netlify
2. **PHP Script** - Only works on PHP servers (not Python HTTP server)  
3. **EmailJS** - Needs proper service configuration

## Solutions:

### Option 1: Use EmailJS (Recommended for immediate testing)
1. Go to https://www.emailjs.com/
2. Create free account
3. Create email service (Gmail/Outlook)
4. Create email template
5. Get Service ID, Template ID, and Public Key
6. Update contact.js with real credentials

### Option 2: Use Formspree (Simple alternative)
1. Go to https://formspree.io/
2. Create account  
3. Get form endpoint
4. Update contact.js with endpoint

### Option 3: Deploy to Netlify (Production ready)
1. Deploy to Netlify
2. Form will automatically work with Netlify Forms
3. Emails sent to studio@tukang.design

## For Local Testing:
Currently the form shows success modal but emails go to:
- Console log (for debugging)
- Mailto fallback (opens email client)

