import { pgTable, uuid, char, text, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { timestamps } from './commons.js';

import { genUUIDv7 } from '../../utils/uuidv7.js';

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().$defaultFn(() => genUUIDv7()),
  user_id: integer('user_id').notNull(),
  type: char('type', { length: 1 }).notNull(), // '1' texto, '2' audio
  category: varchar('category', { length: 50 }).default('Apunte').notNull(),
  is_completed: boolean('is_completed').default(false).notNull(),
  origin: varchar('origin', { length: 30 }).default('whatsapp').notNull(),
  content: text('content').notNull(),
  ...timestamps
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert; 