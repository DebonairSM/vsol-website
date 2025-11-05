import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './api/health.js';
import { leadsRoutes } from './api/leads.js';
import { referralsRoutes } from './api/referrals.js';

export async function registerRoutes(app: FastifyInstance) {
  // Health check route
  await app.register(healthRoutes, { prefix: '/api' });
  
  // Leads route (for spreadsheet automation forms)
  await app.register(leadsRoutes, { prefix: '/api' });
  
  // Referrals route (for referral program)
  await app.register(referralsRoutes, { prefix: '/api' });

  // API routes will be added here as the application grows
  // Example structure:
  // await app.register(contentRoutes, { prefix: '/api/content' });
  // await app.register(contactRoutes, { prefix: '/api/contact' });

  // Catch-all route for SPA - serve index.html for any non-API route
  app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api')) {
      reply.status(404).send({ error: 'API endpoint not found' });
    } else if (
      request.url.startsWith('/data/') ||
      request.url.startsWith('/images/') ||
      request.url.startsWith('/assets/')
    ) {
      // Don't serve index.html for static asset requests - let them 404
      reply.status(404).send({ error: 'File not found' });
    } else {
      // Serve index.html for client-side routing (actual page routes)
      reply.sendFile('index.html');
    }
  });
}

