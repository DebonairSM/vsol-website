# Quick Start Guide

## Get Up and Running in 3 Steps

### 1. Install Dependencies

```bash
cd vsol-website
npm install
```

This will install all required packages for both backend and frontend.

### 2. Start Development Server

```bash
npm run dev
```

This command starts:
- Backend server on `http://localhost:8080`
- Frontend dev server on `http://localhost:5173`

### 3. Open in Browser

Navigate to `http://localhost:5173` to see your site.

## What You'll See

- Modern responsive design with Tailwind CSS
- Interactive navigation with smooth scrolling
- Carousel for events section
- All content migrated from the ASP.NET version

## Making Changes

### Update Content

Edit `client/src/data/content.json` to modify text, job listings, events, etc.

### Customize Styles

- Main styles: `client/src/styles/main.css`
- Tailwind config: `tailwind.config.js`

### Add API Routes

Create new route files in `src/routes/api/` and register them in `src/routes/index.ts`

### Modify Database Schema

1. Update `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Run migration: `npm run db:migrate`

## Common Commands

```bash
# Development
npm run dev              # Start dev servers
npm run dev:server       # Backend only
npm run dev:client       # Frontend only

# Production
npm run build            # Build everything
npm start                # Run production server

# Database
npm run db:studio        # Open database GUI
npm run db:migrate       # Run migrations

# Code Quality
npm run lint             # Check code
npm run lint:fix         # Fix issues
npm run format           # Format code
```

## Troubleshooting

### Port Already in Use

If port 8080 or 5173 is in use, update the `PORT` in `.env` or the Vite port in `vite.config.ts`.

### Database Errors

If you encounter database errors:

```bash
rm -rf data/vsol.db
npm run db:migrate
```

### Build Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules
npm install
```

## Next Steps

1. Review the `README.md` for complete documentation
2. Explore the code structure
3. Customize colors in `tailwind.config.js`
4. Add your own features!

## Need Help?

Check the full `README.md` for detailed information on architecture, deployment, and advanced features.

