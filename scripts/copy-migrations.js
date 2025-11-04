#!/usr/bin/env node

import { cpSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const source = './src/db/migrations';
  const dest = './dist/db/migrations';
  
  // Ensure destination directory exists
  mkdirSync(dirname(dest), { recursive: true });
  
  // Copy migrations folder
  cpSync(source, dest, { recursive: true });
  
  console.log('✓ Migrations copied successfully');
} catch (error) {
  console.error('Error copying migrations:', error);
  process.exit(1);
}

