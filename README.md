# VSol Software Website

Modern, responsive website for VSol Software Consulting built with Node.js, TypeScript, Fastify, and Tailwind CSS.

## Features

- Modern, responsive design with Tailwind CSS
- Server-side rendering with Fastify
- SQLite database with Drizzle ORM (ready for future CMS features)
- TypeScript for type safety
- Vite for fast frontend builds
- ESLint and Prettier for code quality
- Health check endpoints
- Structured logging with Pino
- Security headers with Helmet

## Architecture

The project follows a layered architecture with clear separation of concerns:

- **Backend:** Fastify server with routes, services, and database layers
- **Frontend:** Vite-built single-page application with TypeScript
- **Database:** SQLite with Drizzle ORM for future content management
- **Configuration:** Environment-based config with Zod validation

## Prerequisites

- Node.js 18+ 
- npm or pnpm

## Getting Started

### 1. Clone and Install

```bash
cd vsol-website
npm install
```

### 2. Configure Environment

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

Default configuration:
- Port: 3000
- Database: ./data/vsol.db
- Environment: development

### 3. Run in Development

Start both the backend server and frontend development server:

```bash
npm run dev
```

This will:
- Start the Fastify server on `http://localhost:3000`
- Start the Vite dev server on `http://localhost:5173` (proxies API requests to :3000)

Open your browser to `http://localhost:5173` to see the site.

### 4. Build for Production

Build both client and server:

```bash
npm run build
```

This creates:
- `dist/public/` - Built frontend assets
- `dist/` - Compiled TypeScript server code

### 5. Run in Production

```bash
npm start
```

Server runs on `http://localhost:3000` (or your configured PORT)

## Available Scripts

- `npm run dev` - Run development servers (backend + frontend)
- `npm run dev:server` - Run backend only with hot reload
- `npm run dev:client` - Run frontend only with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm test` - Run tests with Vitest

## Project Structure

```
vsol-website/
├── src/                      # Backend source
│   ├── server.ts            # Server entry point
│   ├── app.ts               # Fastify app factory
│   ├── config/              # Configuration management
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── db/                  # Database & migrations
│   ├── middleware/          # Error handling, security
│   ├── types/               # TypeScript types
│   └── utils/               # Utilities
├── client/                  # Frontend source
│   ├── src/
│   │   ├── main.ts         # Frontend entry point
│   │   ├── components/     # UI components
│   │   ├── services/       # API client
│   │   ├── styles/         # Tailwind CSS
│   │   └── data/           # Content data
│   └── public/             # Static assets
│       └── images/         # Images
├── dist/                    # Build output
├── tests/                   # Tests
└── data/                    # SQLite database
```

## Database

The project uses SQLite with Drizzle ORM. The schema is set up with tables for future CMS functionality:

- `content` - For blog posts, events, news
- `contact_submissions` - For contact form submissions
- `settings` - For site configuration

To generate migrations after schema changes:

```bash
npm run db:generate
npm run db:migrate
```

To explore the database with Drizzle Studio:

```bash
npm run db:studio
```

## API Endpoints

### Health Checks

- `GET /api/health` - Basic health check
- `GET /api/health/ready` - Readiness check with dependencies

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production/test) | development |
| PORT | Server port | 3000 |
| HOST | Server host | 0.0.0.0 |
| DATABASE_URL | SQLite database path | ./data/vsol.db |
| LOG_LEVEL | Logging level (trace/debug/info/warn/error/fatal) | info |

## Deployment

### Docker (Future)

A Dockerfile can be added for containerized deployment.

### Traditional Hosting

1. Build the project: `npm run build`
2. Copy `dist/`, `node_modules/`, `package.json`, and `.env` to your server
3. Run: `NODE_ENV=production npm start`

### Static Hosting + API

You can deploy the frontend to static hosting (Vercel, Netlify) and the API separately:

1. Build client: `npm run build:client`
2. Deploy `dist/public/` to static host
3. Deploy backend separately to a Node.js host
4. Update CORS settings in `src/middleware/security.ts`

## Future Enhancements

The architecture supports adding:

- Content Management System (CMS) for blog/events
- Contact form with email notifications
- User authentication and admin panel
- Job application system
- Analytics integration
- SEO improvements with meta tags per page
- Internationalization (i18n) for multiple languages

## Tech Stack

**Backend:**
- Fastify - Web framework
- Drizzle ORM - Type-safe database toolkit
- better-sqlite3 - SQLite driver
- Zod - Runtime type validation
- Pino - Structured logging

**Frontend:**
- Vite - Build tool
- TypeScript - Type safety
- Tailwind CSS - Utility-first CSS
- Vanilla JavaScript - No heavy frameworks

**Development:**
- ESLint - Linting
- Prettier - Code formatting
- Vitest - Testing
- tsx - TypeScript execution

## Contributing

This is a private project for VSol Software. For internal development:

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint:fix`
4. Format code: `npm run format`
5. Test your changes
6. Submit a pull request

## License

Proprietary - VSol Software © 2024

