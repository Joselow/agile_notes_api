import { db } from "../database/index.js"
import { and, eq, sql } from "drizzle-orm";

import { notes, type NewNote, type Note } from "../database/schemes/note.js"

import { type NoteTypeT } from "../constants/noteType.js";

const createNote = async (note: NewNote) => {
  console.log(note);
  const [newNote] = await db.insert(notes)
                            .values(note)
                            .returning();
  return newNote;
}

const getNotes = (userId?: number, type?: NoteTypeT, date?: string): Promise<Note[]> => {
  // 1. Creamos un array para las condiciones dinámicas
  const filters = [];

  // 2. Agregamos solo si existen los parámetros
  if (userId) filters.push(eq(notes.user_id, userId));
  if (type) filters.push(eq(notes.type, type));

  console.log({date});
  
  if (date) {
    filters.push(
      sql`CAST(${notes.createdAt} AS DATE) = ${date}`
    );
  }

  // 3. Ejecutamos la consulta usando 'and' para unir los filtros
  return db
    .select()
    .from(notes)
    .where(and(...filters));
};

export { createNote, getNotes }