import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8081),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('./data/vsol.db'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  SENDGRID_API_KEY: z.string().optional(),
  ADMIN_EMAIL: z.string().email().default('rommel@vsol.software'),
  REFERRAL_NOTIFICATION_ENABLED: z.coerce.boolean().default(true),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Environment validation failed:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

