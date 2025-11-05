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
- Referral landing page with email notifications
- Rate limiting and spam protection
- Render MCP server integration for AI-powered infrastructure management

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
- Start the Fastify server on `http://localhost:8080`
- Start the Vite dev server on `http://localhost:5173` (proxies API requests to :8080)

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

Server runs on `http://localhost:8080` (or your configured PORT)

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

The project uses SQLite with Drizzle ORM. The schema includes:

- `content` - For blog posts, events, news
- `contact_submissions` - For contact form submissions
- `settings` - For site configuration
- `leads` - For spreadsheet automation form submissions
- `referrals` - For referral program submissions

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

### Referrals

- `POST /api/referral/submit` - Submit a new referral
- `GET /api/referrals` - Get all referrals (admin)

### Leads

- `POST /api/leads` - Submit a new lead from spreadsheet automation
- `GET /api/leads` - Get all leads (admin)

## Referral Landing Page

The referral landing page allows recipients of outreach emails to submit referrals by accessing a URL with an encoded referrer parameter.

### Setup

1. **Configure SendGrid API Key:**
   
   Add your SendGrid API key to your environment variables. You can obtain an API key from [SendGrid's API Keys page](https://app.sendgrid.com/settings/api_keys).
   
   Create a `.env` file in the project root:
   ```bash
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   ADMIN_EMAIL=rommel@vsol.software
   REFERRAL_NOTIFICATION_ENABLED=true
   ```

2. **Generate Referral Links:**
   
   Referral links use Base64 encoding with the format: `VSOL:FirstName:LastName`
   
   Example in Node.js:
   ```javascript
   const referrerData = `VSOL:John:Smith`;
   const encoded = Buffer.from(referrerData).toString('base64');
   const referralUrl = `https://vsol.software/referral?ref=${encoded}`;
   // https://vsol.software/referral?ref=VlNPTDpKb2huOlNtaXRo
   ```

3. **Access the Page:**
   
   Navigate to `http://localhost:8080/referral.html` in development or `https://vsol.software/referral` in production.

### Features

- Personalized greeting using decoded referrer information
- LinkedIn profile URL validation
- Email validation
- Optional phone number field
- Honeypot spam protection
- Rate limiting (5 submissions per IP per 15 minutes)
- Email notifications to both referrer and admin
- Mobile-responsive design
- Success/error message handling

### Database

Referrals are stored in the `referrals` table with the following fields:
- Referrer first and last name
- Referral LinkedIn URL
- Referral email and phone
- IP address and user agent
- Submission timestamp

### Email Notifications

When a referral is submitted, two emails are sent via SendGrid:
1. **Confirmation email** to the referrer thanking them for the submission
2. **Notification email** to the admin with the referral details

To disable email notifications, set `REFERRAL_NOTIFICATION_ENABLED=false` in your environment.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production/test) | development |
| PORT | Server port | 8081 |
| HOST | Server host | 0.0.0.0 |
| DATABASE_URL | SQLite database path | ./data/vsol.db |
| LOG_LEVEL | Logging level (trace/debug/info/warn/error/fatal) | info |
| SENDGRID_API_KEY | SendGrid API key for email notifications (optional) | - |
| ADMIN_EMAIL | Email address to receive referral notifications | rommel@vsol.software |
| REFERRAL_NOTIFICATION_ENABLED | Enable/disable email notifications | true |
| RENDER_API_KEY | Render API key for MCP server (optional) | - |

## Render MCP Server

This project is configured with the official Render MCP server, which enables AI-powered management of your Render infrastructure directly from Cursor or other MCP-compatible editors.

### Setup

1. **Generate a Render API Key:**
   - Log in to your Render account
   - Navigate to Account Settings
   - Create a new API key

2. **Configure the API Key:**
   
   Copy the example configuration file:
   ```bash
   cp mcp.json.example mcp.json
   ```
   
   Then update `mcp.json` with your Render API key:
   ```json
   {
     "mcpServers": {
       "render": {
         "command": "npx",
         "args": ["-y", "@render/mcp-server-render"],
         "env": {
           "RENDER_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

3. **Restart Cursor:**
   After updating the configuration, restart Cursor to activate the MCP server.

### Capabilities

With the Render MCP server connected, you can:

- Create and deploy web services, static sites, and databases using natural language
- Analyze service metrics (CPU, memory, HTTP traffic)
- Fetch and filter service logs
- Query databases directly
- Update service environment variables

### Security

The Render MCP server restricts destructive operations like deleting services or databases. It allows creating services and updating environment variables while maintaining security.

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

