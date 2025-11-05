import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../db/index.js';
import { referrals } from '../../db/schema.js';
import { sendReferralNotification } from '../../services/email.js';

interface ReferralBody {
  referrerFirstName: string;
  referrerLastName: string;
  linkedinUrl: string;
  email: string;
  phone?: string;
  about?: string;
  website?: string; // Honeypot field
}

// Simple in-memory rate limiting store
// In production, you might want to use Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 1000); // Clean up every minute

export async function referralsRoutes(app: FastifyInstance) {
  // Submit a referral
  app.post(
    '/referral/submit',
    async (
      request: FastifyRequest<{ Body: ReferralBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { referrerFirstName, referrerLastName, linkedinUrl, email, phone, about, website } = request.body;

        // Honeypot check - if website field is filled, it's likely a bot
        if (website) {
          app.log.warn({ ip: request.ip }, 'Honeypot triggered - potential bot submission');
          return reply.status(400).send({
            success: false,
            error: 'Invalid submission',
          });
        }

        // Rate limiting
        const clientIp = request.ip;
        if (!checkRateLimit(clientIp)) {
          app.log.warn({ ip: clientIp }, 'Rate limit exceeded');
          return reply.status(429).send({
            success: false,
            error: 'Too many referral submissions. Please try again later.',
          });
        }

        // Validate required fields
        if (!referrerFirstName || !referrerLastName || !linkedinUrl || !email) {
          return reply.status(400).send({
            success: false,
            error: 'Missing required fields',
          });
        }

        // Validate LinkedIn URL format
        const linkedinRegex = /^https?:\/\/([a-z]+\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        if (!linkedinRegex.test(linkedinUrl)) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid LinkedIn URL format. Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)',
          });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid email address',
          });
        }

        // Get client info
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'] || '';

        // Insert referral into database
        const db = getDatabase();
        const result = await db.insert(referrals).values({
          referrerFirstName,
          referrerLastName,
          referralLinkedinUrl: linkedinUrl,
          referralEmail: email,
          referralPhone: phone || null,
          referralAbout: about || null,
          ipAddress,
          userAgent,
        }).returning();

        app.log.info({
          referralId: result[0].id,
          referrerName: `${referrerFirstName} ${referrerLastName}`,
          referralEmail: email,
        }, 'New referral created');

        // Send email notification to admin asynchronously (don't block response)
        sendReferralNotification({
          referrerFirstName,
          referrerLastName,
          referralLinkedinUrl: linkedinUrl,
          referralEmail: email,
          referralPhone: phone,
          referralAbout: about,
        }, app.log).catch(error => {
          app.log.error({ error }, 'Failed to send email notification');
        });

        return reply.status(201).send({
          success: true,
          message: 'Thank you! Your referral has been submitted successfully.',
        });
      } catch (error) {
        app.log.error({
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
          body: request.body,
        }, 'Error creating referral');

        return reply.status(500).send({
          success: false,
          error: 'An error occurred while saving your referral. Please try again.',
        });
      }
    }
  );

  // Get all referrals (for admin/internal use)
  app.get('/referrals', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const db = getDatabase();
      const allReferrals = await db.select().from(referrals);

      return reply.send({
        success: true,
        data: allReferrals,
      });
    } catch (error) {
      app.log.error({
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      }, 'Error fetching referrals');
      
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch referrals',
      });
    }
  });
}

