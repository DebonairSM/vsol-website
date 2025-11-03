import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { getDatabase, closeDatabase } from './db/index.js';

async function start() {
  try {
    // Initialize database
    getDatabase();
    
    // Create and start the app
    const app = await createApp();

    await app.listen({
      port: config.server.port,
      host: config.server.host,
    });

    logger.info(
      `Server running at http://${config.server.host}:${config.server.port}`
    );
    logger.info(`Environment: ${config.env}`);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, closing server...`);
        await app.close();
        closeDatabase();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server:');
    process.exit(1);
  }
}

start();

