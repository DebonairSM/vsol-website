import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { getDatabase } from './index.js';
import { logger } from '../utils/logger.js';

async function runMigrations() {
  try {
    logger.info('Running database migrations...');
    const db = getDatabase();
    
    migrate(db, { migrationsFolder: './src/db/migrations' });
    
    logger.info('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();

