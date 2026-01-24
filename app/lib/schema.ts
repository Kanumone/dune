import { pgTable, serial, decimal, varchar, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  lat: decimal('lat', { precision: 10, scale: 6 }).notNull(),
  lng: decimal('lng', { precision: 10, scale: 6 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  badges: text('badges').array().notNull().default([]),
  categories: text('categories').array().notNull().default([]),
  popularity: varchar('popularity', { length: 20 }).notNull(),
  clicks: integer('clicks').notNull().default(0),
  canShow: boolean('can_show').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
