import Fastify, { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { registerSecurityPlugins } from './middleware/security.js';
import { registerRoutes } from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.logging.level,
      transport: config.isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    },
  });

  // Register error handler
  app.setErrorHandler(errorHandler);

  // Register security plugins
  await registerSecurityPlugins(app);

  // Serve static files from the built client
  const publicPath = config.isProduction
    ? join(__dirname, 'public')
    : join(__dirname, '../../client/public');

  await app.register(fastifyStatic, {
    root: publicPath,
    prefix: '/',
    preCompressed: config.isProduction,
  });

  // Register API routes
  await registerRoutes(app);

  return app;
}

