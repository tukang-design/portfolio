# EmailJS Setup Guide

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - Gmail (recommended)
   - Outlook
   - Yahoo
   - Or any SMTP service

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

Template ID: template_contact_form
Subject: New Contact Form Inquiry from {{from_name}}

Body:
---
New inquiry from your portfolio website:

Name: {{from_name}}
Email: {{from_email}}
Service: {{service_type}}

Message:
{{message}}

---
Please respond to: {{from_email}}
---

## Step 4: Get Your Keys
1. Go to "Account" → "General"
2. Copy your Public Key
3. Go to "Email Services" and copy your Service ID
4. Go to "Email Templates" and copy your Template ID

## Step 5: Update the code
We'll update contact.js with your real keys!
