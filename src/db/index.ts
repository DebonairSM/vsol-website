import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import * as schema from './schema.js';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

let db: ReturnType<typeof drizzle> | null = null;

export function getDatabase() {
  if (!db) {
    // Ensure the database directory exists
    const dbPath = config.database.url;
    const dbDir = dirname(dbPath);
    
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
      logger.info(`Created database directory: ${dbDir}`);
    }

    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    
    db = drizzle(sqlite, { schema });
    logger.info(`Connected to database: ${dbPath}`);
  }

  return db;
}

export function closeDatabase() {
  if (db) {
    // Better-sqlite3 doesn't have an explicit close in the drizzle wrapper
    // The connection will close when the process exits
    db = null;
    logger.info('Database connection closed');
  }
}

export { schema };

