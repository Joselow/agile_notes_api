import { pgTable, uuid, char, text, integer, } from 'drizzle-orm/pg-core';
import { timestamps } from './commons.js';

import { genUUIDv7 } from '../../utils/uuidv7.js';

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().$defaultFn(() => genUUIDv7()),
  user_id: integer('user_id').notNull(),
  type: char('type', { length: 1 }).notNull(), // '1' para texto, '2' para audio
  content: text('content').notNull(),  
  ...timestamps
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert; 