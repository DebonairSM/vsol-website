# Referral Landing Page Setup Guide

This guide will help you set up and use the referral landing page feature.

## Overview

The referral landing page allows you to send personalized referral links to your contacts. Recipients can submit referrals through a simple form, and you'll receive email notifications about new referrals.

## Setup Instructions

### 1. Configure SendGrid

1. **Create a SendGrid Account:**
   - Go to [SendGrid](https://signup.sendgrid.com/)
   - Sign up for a free account (100 emails/day)

2. **Create an API Key:**
   - Log in to SendGrid
   - Navigate to Settings > API Keys
   - Click "Create API Key"
   - Choose "Full Access" or "Restricted Access" with Mail Send enabled
   - Copy the API key (you won't be able to see it again)

3. **Add API Key to Environment:**
   
   Create or edit the `.env` file in your project root:
   
   ```bash
   SENDGRID_API_KEY=SG.your_actual_api_key_here
   ADMIN_EMAIL=rommel@vsol.software
   REFERRAL_NOTIFICATION_ENABLED=true
   ```
   
   **Important:** Never commit the `.env` file to version control. It should already be in `.gitignore`.

### 2. Run Database Migrations

If you haven't already, run the database migrations to create the referrals table:

```bash
npm run db:migrate
```

### 3. Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Generate a test referral link (see "Generating Referral Links" below)

3. Open the link in your browser

4. Fill out and submit the form

5. Check:
   - Database for the new referral entry
   - Email inbox for confirmation and notification emails

## Generating Referral Links

Referral links encode the referrer's name using Base64 with the format: `VSOL:FirstName:LastName`

### Using Node.js

```javascript
function generateReferralLink(firstName, lastName) {
  const referrerData = `VSOL:${firstName}:${lastName}`;
  const encoded = Buffer.from(referrerData).toString('base64');
  return `https://vsol.software/referral?ref=${encoded}`;
}

// Example
const link = generateReferralLink('John', 'Smith');
console.log(link);
// Output: https://vsol.software/referral?ref=VlNPTDpKb2huOlNtaXRo
```

### Using JavaScript (Browser)

```javascript
function generateReferralLink(firstName, lastName) {
  const referrerData = `VSOL:${firstName}:${lastName}`;
  const encoded = btoa(referrerData);
  return `https://vsol.software/referral?ref=${encoded}`;
}
```

### Using Python

```python
import base64

def generate_referral_link(first_name, last_name):
    referrer_data = f"VSOL:{first_name}:{last_name}"
    encoded = base64.b64encode(referrer_data.encode()).decode()
    return f"https://vsol.software/referral?ref={encoded}"

# Example
link = generate_referral_link("John", "Smith")
print(link)
# Output: https://vsol.software/referral?ref=VlNPTDpKb2huOlNtaXRo
```

### Using Command Line

```bash
# Linux/Mac
echo -n "VSOL:John:Smith" | base64
# Output: VlNPTDpKb2huOlNtaXRo

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("VSOL:John:Smith"))
```

Then append the encoded string to the URL:
```
https://vsol.software/referral?ref=VlNPTDpKb2huOlNtaXRo
```

## Usage

### Sending Referral Links

1. Generate a referral link with the contact's name
2. Include the link in your outreach email
3. When they click the link, they'll see a personalized greeting
4. They can submit referral details through the form

### Email Notifications

When a referral is submitted, you'll receive two types of emails:

1. **Confirmation Email (to referrer):**
   - Sent to the email address in the referral form
   - Thanks them for submitting the referral
   - Confirms we'll reach out to the referred contact

2. **Notification Email (to admin):**
   - Sent to the email specified in `ADMIN_EMAIL`
   - Contains all referral details
   - Includes clickable LinkedIn profile link

### Viewing Referrals

You can view all submitted referrals by:

1. **Database:**
   ```bash
   npm run db:studio
   ```
   Navigate to the `referrals` table

2. **API Endpoint:**
   ```bash
   curl http://localhost:8081/api/referrals
   ```

## Security Features

The referral system includes several security measures:

1. **Rate Limiting:** Maximum 5 submissions per IP address per 15 minutes
2. **Honeypot:** Hidden field to catch bots
3. **Input Validation:** LinkedIn URL and email format validation
4. **HTTPS Required:** Always use HTTPS in production
5. **SQL Injection Protection:** Parameterized queries via Drizzle ORM

## Troubleshooting

### Emails Not Sending

1. **Check SendGrid API Key:**
   ```bash
   echo $SENDGRID_API_KEY
   ```
   Make sure it's set correctly in your `.env` file

2. **Check Server Logs:**
   Look for email-related errors in the console output

3. **Verify SendGrid Account:**
   - Log in to SendGrid
   - Check your account status
   - Verify you haven't exceeded your daily limit
   - Check Activity Feed for failed deliveries

4. **Test Email Configuration:**
   Check that `REFERRAL_NOTIFICATION_ENABLED=true` in your `.env` file

### Form Not Submitting

1. **Check Browser Console:**
   Open Developer Tools (F12) and check for JavaScript errors

2. **Verify API Endpoint:**
   Make sure the server is running on the correct port

3. **Check Rate Limiting:**
   If testing multiple times, you may have hit the rate limit. Wait 15 minutes or restart the server.

### Invalid Referral Link

1. **Check Encoding:**
   Make sure the Base64 encoding includes the `VSOL:` prefix
   
2. **Test Decoding:**
   ```javascript
   const decoded = atob('VlNPTDpKb2huOlNtaXRo');
   console.log(decoded); // Should output: VSOL:John:Smith
   ```

## Production Deployment

### Environment Variables

Make sure these are set in your production environment:

```bash
SENDGRID_API_KEY=your_production_api_key
ADMIN_EMAIL=rommel@vsol.software
REFERRAL_NOTIFICATION_ENABLED=true
NODE_ENV=production
```

### Render Deployment

If deploying to Render:

1. Add environment variables in the Render dashboard
2. Never commit the `.env` file
3. Use Render's environment variable management

### Testing in Production

1. Generate a test referral link
2. Submit a test referral
3. Verify emails are received
4. Check database entry

## Customization

### Email Templates

Email templates are in `src/services/email.ts`. You can customize:
- Subject lines
- Email body text
- HTML styling
- Sender information

### Form Fields

To add more fields to the referral form:

1. Update `client/referral.html`
2. Update `client/src/referral-main.ts` validation
3. Update `src/routes/api/referrals.ts` API endpoint
4. Update `src/db/schema.ts` database schema
5. Generate and run migration

### Styling

The referral page styles are in `client/src/styles/referral.css`. You can customize:
- Colors
- Fonts
- Layout
- Responsive breakpoints

## Support

For questions or issues with the referral system:
- Email: rommel@vsol.software
- Phone: (352) 397-8650

## Example Email Template

Here's a sample email you can use when sending referral links:

```
Subject: Quick Question About Software Development

Hi [Name],

I hope this email finds you well. I'm reaching out because I thought 
you might know someone who could benefit from our software development 
services.

We specialize in [your specialties] and have helped companies like 
[examples] achieve [results].

If you know anyone who might be interested, I'd really appreciate a 
referral. You can submit their information here:

[Your Referral Link]

It'll only take a minute, and I'll make sure to take good care of anyone 
you refer.

Thanks so much!

Best regards,
[Your Name]
```

## Next Steps

1. Set up your SendGrid API key
2. Test the referral form
3. Generate referral links for your contacts
4. Monitor submissions via database or API
5. Follow up with referrals promptly

