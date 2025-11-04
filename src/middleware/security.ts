import type { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';

export async function registerSecurityPlugins(app: FastifyInstance) {
  // CORS configuration
  await app.register(cors, {
    origin: true, // Allow all origins in development, configure for production
    credentials: true,
  });

  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        frameSrc: ["'self'", 'https://www.google.com', 'https://docs.google.com'],
      },
    },
  });
}

