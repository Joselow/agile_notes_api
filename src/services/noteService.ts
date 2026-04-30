import { db } from "../database/index.js"
import { and, eq, sql } from "drizzle-orm";

import { notes, type NewNote, type Note } from "../database/schemes/note.js"

import { NOTE_TYPE, type NoteTypeT } from "../constants/noteType.js";

const createNote = async (note: NewNote) => {
  const [newNote] = await db.insert(notes).values(note).returning();
  return newNote;
};

const getNotes = (
  userId?: number,
  type?: NoteTypeT,
  dateStart?: string,
  dateEnd?: string,
): Promise<Note[]> => {
  const filters = [];

  if (userId) filters.push(eq(notes.user_id, userId));
  if (type) filters.push(eq(notes.type, NOTE_TYPE[type].id));

  if (dateStart && dateEnd) {
    filters.push(sql`CAST(${notes.createdAt} AS DATE) >= ${dateStart}::date`);
    filters.push(sql`CAST(${notes.createdAt} AS DATE) <= ${dateEnd}::date`);
  } else if (dateStart) {
    filters.push(sql`CAST(${notes.createdAt} AS DATE) >= ${dateStart}::date`);
  } else if (dateEnd) {
    filters.push(sql`CAST(${notes.createdAt} AS DATE) <= ${dateEnd}::date`);
  }

  const condition =
    filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters);

  const q = db.select().from(notes);
  return condition ? q.where(condition) : q;
};

const getNoteByIdForUser = async (
  id: string,
  userId: number,
): Promise<Note | undefined> => {
  const [row] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.user_id, userId)));
  return row;
};

const updateNoteById = async (
  id: string,
  userId: number,
  patch: Pick<Partial<Note>, "content" | "is_completed" | "category">,
): Promise<Note | undefined> => {
  const [updated] = await db
    .update(notes)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.user_id, userId)))
    .returning();
  return updated;
};

export { createNote, getNotes, getNoteByIdForUser, updateNoteById };