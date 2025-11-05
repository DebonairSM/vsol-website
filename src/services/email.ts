import sgMail from '@sendgrid/mail';
import { config } from '../config/index.js';
import type { FastifyBaseLogger } from 'fastify';

let isInitialized = false;

export function initializeSendGrid() {
  if (!config.email.sendgridApiKey) {
    console.warn('SendGrid API key not configured. Email notifications will be skipped.');
    return;
  }
  
  sgMail.setApiKey(config.email.sendgridApiKey);
  isInitialized = true;
}

interface ReferralConfirmationData {
  referrerFirstName: string;
  referrerLastName: string;
  referralEmail: string;
}

interface ReferralNotificationData {
  referrerFirstName: string;
  referrerLastName: string;
  referralLinkedinUrl: string;
  referralEmail: string;
  referralPhone?: string;
}

export async function sendReferralConfirmation(
  data: ReferralConfirmationData,
  logger?: FastifyBaseLogger
): Promise<boolean> {
  if (!isInitialized || !config.email.referralNotificationEnabled) {
    logger?.info('Email notifications disabled, skipping referral confirmation email');
    return false;
  }

  const msg = {
    to: data.referralEmail,
    from: config.email.adminEmail,
    subject: 'Thank you for your referral to VSol Software',
    text: `Dear ${data.referrerFirstName} ${data.referrerLastName},\n\nThank you for submitting a referral to VSol Software!\n\nWe've received your submission and will reach out to ${data.referralEmail} soon.\n\nWe appreciate you helping us connect with potential clients.\n\nBest regards,\nThe VSol Software Team\n\nwww.vsol.software\n(352) 397-8650`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0066CC; color: white; padding: 30px 20px; text-align: center; }
          .content { background-color: #f8f9fa; padding: 30px 20px; }
          .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          .footer a { color: #0066CC; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.referrerFirstName} ${data.referrerLastName},</p>
            <p>Thank you for submitting a referral to VSol Software!</p>
            <p>We've received your submission and will reach out to <strong>${data.referralEmail}</strong> soon.</p>
            <p>We appreciate you helping us connect with potential clients.</p>
            <p>Best regards,<br>The VSol Software Team</p>
          </div>
          <div class="footer">
            <p><a href="https://www.vsol.software">www.vsol.software</a> | (352) 397-8650</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    logger?.info({ to: data.referralEmail }, 'Referral confirmation email sent');
    return true;
  } catch (error) {
    logger?.error({ error, to: data.referralEmail }, 'Failed to send referral confirmation email');
    return false;
  }
}

export async function sendReferralNotification(
  data: ReferralNotificationData,
  logger?: FastifyBaseLogger
): Promise<boolean> {
  if (!isInitialized || !config.email.referralNotificationEnabled) {
    logger?.info('Email notifications disabled, skipping admin notification email');
    return false;
  }

  const msg = {
    to: config.email.adminEmail,
    from: config.email.adminEmail,
    subject: `New Referral from ${data.referrerFirstName} ${data.referrerLastName}`,
    text: `New referral submission received!\n\nReferrer: ${data.referrerFirstName} ${data.referrerLastName}\n\nReferral Details:\n- LinkedIn: ${data.referralLinkedinUrl}\n- Email: ${data.referralEmail}\n- Phone: ${data.referralPhone || 'Not provided'}\n\nLog in to your admin panel to follow up.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28A745; color: white; padding: 30px 20px; text-align: center; }
          .content { background-color: #f8f9fa; padding: 30px 20px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #0066CC; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Referral Submission</h1>
          </div>
          <div class="content">
            <p><strong>Referrer:</strong> ${data.referrerFirstName} ${data.referrerLastName}</p>
            <hr>
            <h3>Referral Details:</h3>
            <div class="info-row">
              <span class="label">LinkedIn:</span> <a href="${data.referralLinkedinUrl}">${data.referralLinkedinUrl}</a>
            </div>
            <div class="info-row">
              <span class="label">Email:</span> <a href="mailto:${data.referralEmail}">${data.referralEmail}</a>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span> ${data.referralPhone || 'Not provided'}
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    logger?.info({ adminEmail: config.email.adminEmail }, 'Referral notification email sent to admin');
    return true;
  } catch (error) {
    logger?.error({ error, adminEmail: config.email.adminEmail }, 'Failed to send referral notification email');
    return false;
  }
}

