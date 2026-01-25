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
  size: varchar('size', { length: 20 }).notNull().default('не указан'),
  canShow: boolean('can_show').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
