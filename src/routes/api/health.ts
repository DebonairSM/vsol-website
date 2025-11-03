import type { FastifyInstance } from 'fastify';
import { config } from '../../config/index.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.env,
      uptime: process.uptime(),
    };
  });

  app.get('/health/ready', async () => {
    // Add any readiness checks here (database, external services, etc.)
    return {
      status: 'ready',
      checks: {
        database: 'ok',
      },
    };
  });
}

