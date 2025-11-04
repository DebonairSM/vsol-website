import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { getDatabase, closeDatabase } from './db/index.js';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function start() {
  try {
    // Initialize database
    const db = getDatabase();
    
    // Run migrations
    logger.info('Running database migrations...');
    // In production, migrations are in dist/db/migrations
    // In development, they are in src/db/migrations
    const migrationsFolder = config.isProduction 
      ? join(__dirname, 'db', 'migrations')
      : './src/db/migrations';
    migrate(db, { migrationsFolder });
    logger.info('Migrations completed successfully');
    
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

