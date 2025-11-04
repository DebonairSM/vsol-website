# Database Migration Fix for Production

## Problem
The production server on Render was experiencing `SQLITE_ERROR` when trying to create leads through the `/api/leads` endpoint. The error occurred because database migrations were not running automatically when the server started, resulting in missing database tables.

## Root Cause
The server was only initializing the database connection (`getDatabase()`) but not running migrations to create the necessary tables. While migrations could be run manually via `npm run db:migrate`, this was not happening automatically during deployment or server startup.

## Solution

### 1. Automatic Migration on Startup
Modified `src/server.ts` to automatically run database migrations when the server starts:

```typescript
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

// Run migrations on startup
const db = getDatabase();
logger.info('Running database migrations...');
const migrationsFolder = config.isProduction 
  ? join(__dirname, 'db', 'migrations')
  : './src/db/migrations';
migrate(db, { migrationsFolder });
logger.info('Migrations completed successfully');
```

### 2. Migration Files in Build
Added a build step to copy migration files to the dist folder:

- Created `scripts/copy-migrations.js` - Cross-platform script to copy migrations
- Updated `package.json` build script: `build:server && copy:migrations`
- Migrations are now copied from `src/db/migrations` to `dist/db/migrations` during build

## Changes Made

### Files Modified
1. **src/server.ts** - Added automatic migration on startup
2. **package.json** - Added `copy:migrations` script to build process
3. **scripts/copy-migrations.js** - New script to copy migrations (cross-platform)

### How It Works

**Development:**
- Server runs with `tsx watch` and reads migrations from `./src/db/migrations`
- Migrations run automatically when server starts

**Production:**
- Build process copies migrations to `dist/db/migrations`
- Server runs from `dist/` and reads migrations from `dist/db/migrations`
- Migrations run automatically when server starts

## Deployment Instructions for Render

### Option 1: Trigger New Deployment
Simply push these changes to your repository and Render will automatically:
1. Run `npm run build` (which now includes copying migrations)
2. Run `npm start` (which will run migrations on startup)
3. Your database tables will be created automatically

### Option 2: Manual Redeployment
If you've already pushed the changes:
1. Go to your Render dashboard
2. Find your service
3. Click "Manual Deploy" → "Deploy latest commit"

### Verification
After deployment, check the logs for:
```
{"level":30,...,"msg":"Running database migrations..."}
{"level":30,...,"msg":"Migrations completed successfully"}
{"level":30,...,"msg":"Server running at http://0.0.0.0:..."}
```

## Testing Locally

To test the production build locally:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

You should see:
```
Running database migrations...
Migrations completed successfully
Server running at http://0.0.0.0:8081
```

To verify migrations ran:
```bash
sqlite3 data/vsol.db ".tables"
```

Expected output:
```
__drizzle_migrations  contact_submissions   content               leads                 settings
```

To test the API:
```bash
# Create a test lead
curl -X POST http://localhost:8081/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "form_type": "scan"
  }'

# Get all leads
curl http://localhost:8081/api/leads
```

## Database Schema

The migrations create the following tables:

- **leads** - Form submissions from spreadsheet automation page
  - id, name, email, company, description, form_type, status, created_at

- **contact_submissions** - General contact form submissions
  - id, name, email, subject, message, status, created_at

- **content** - CMS content (blog posts, news, events)
  - id, type, title, slug, description, body, image_url, published, published_at, created_at, updated_at

- **settings** - Site configuration
  - key, value, description, updated_at

## Notes

- Migrations are idempotent - they can be run multiple times safely
- The database file is created automatically if it doesn't exist
- WAL mode is enabled for better concurrent access
- All timestamps use Unix epoch format

