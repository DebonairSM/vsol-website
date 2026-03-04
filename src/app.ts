import Fastify, { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import { join, dirname, basename } from 'path';
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

  // Canonical host redirect: apex -> www
  app.addHook('onRequest', async (request, reply) => {
    const host = request.headers.host?.split(':')[0]?.toLowerCase();
    if (host === 'vsol.software') {
      return reply.redirect(301, `https://www.vsol.software${request.raw.url}`);
    }
  });

  // Serve static files: when running from dist/ use built client, else use dev client
  const runningFromDist = basename(__dirname) === 'dist';
  const publicPath =
    config.isProduction || runningFromDist
      ? join(__dirname, 'public')
      : join(__dirname, '../client/public');

  await app.register(fastifyStatic, {
    root: publicPath,
    prefix: '/',
    preCompressed: config.isProduction,
  });

  // Register API routes
  await registerRoutes(app);

  return app;
}

