import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './api/health.js';

export async function registerRoutes(app: FastifyInstance) {
  // Health check route
  await app.register(healthRoutes, { prefix: '/api' });

  // API routes will be added here as the application grows
  // Example structure:
  // await app.register(contentRoutes, { prefix: '/api/content' });
  // await app.register(contactRoutes, { prefix: '/api/contact' });

  // Catch-all route for SPA - serve index.html for any non-API route
  app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api')) {
      reply.status(404).send({ error: 'API endpoint not found' });
    } else {
      // Serve index.html for client-side routing
      reply.sendFile('index.html');
    }
  });
}

