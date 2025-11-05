import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Content table - for future CMS functionality
 * Can store blog posts, news, events, etc.
 */
export const content = sqliteTable('content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // e.g., 'event', 'blog', 'news'
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  body: text('body'),
  imageUrl: text('image_url'),
  published: integer('published', { mode: 'boolean' }).default(false).notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Contact submissions table - for future contact form functionality
 */
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').default('new').notNull(), // 'new', 'read', 'replied'
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Settings table - for site configuration
 */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Leads table - for spreadsheet automation form submissions
 */
export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  description: text('description'),
  formType: text('form_type').notNull(), // 'scan' or 'challenge'
  status: text('status').default('new').notNull(), // 'new', 'contacted', 'converted'
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Referrals table - for referral program submissions
 */
export const referrals = sqliteTable('referrals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  referrerFirstName: text('referrer_first_name').notNull(),
  referrerLastName: text('referrer_last_name').notNull(),
  referrerEmail: text('referrer_email').notNull(),
  referralLinkedinUrl: text('referral_linkedin_url').notNull(),
  referralEmail: text('referral_email').notNull(),
  referralPhone: text('referral_phone'),
  referralAbout: text('referral_about'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  submittedAt: integer('submitted_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;

