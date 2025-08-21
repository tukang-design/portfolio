# 🚀 EmailJS Setup - Step by Step

## Current Status
✅ EmailJS SDK loaded in your website
✅ Contact form configured to use EmailJS
✅ Test functions ready

## What You Need To Do:

### 1. Create EmailJS Account (5 minutes)
- Open: https://www.emailjs.com/
- Click "Sign Up" 
- Use your email address
- Verify your email

### 2. Add Email Service (3 minutes)
- Dashboard → "Email Services" → "Add New Service"
- Choose "Gmail" (recommended)
- Connect your Gmail account
- Note down the SERVICE ID (looks like: service_abc123)

### 3. Create Email Template (5 minutes)
- Dashboard → "Email Templates" → "Create New Template"
- Template ID: `template_contact_form`
- Subject: `New Contact Form Inquiry from {{from_name}}`
- Content:
```
New inquiry from your portfolio website:

Name: {{from_name}}
Email: {{from_email}}
Service: {{service_type}}

Message:
{{message}}

---
Please respond to: {{from_email}}
```

### 4. Get Your Public Key (1 minute)
- Dashboard → "Account" → "General"
- Copy your Public Key (looks like: user_xyz789)

### 5. Update Your Website (2 minutes)
Open js/contact.js and replace:
```javascript
emailjsServiceId: 'YOUR_SERVICE_ID', // Replace with your Service ID
emailjsTemplateId: 'template_contact_form', // Keep this
emailjsPublicKey: 'YOUR_PUBLIC_KEY' // Replace with your Public Key
```

### 6. Test (1 minute)
- Open browser console (F12)
- Type: `testEmailJS()`
- Check studio@tukang.design for test email

## Total Time: ~15 minutes

Once configured, your contact form will automatically send emails to studio@tukang.design!
