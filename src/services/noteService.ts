import { db } from "../database"
import { eq } from "drizzle-orm";

import { notes, type NewNote, type Note } from "../database/schemes/note"

import { type NoteTypeT } from "../constants/noteType";

const createNote = async (note: NewNote) => {
  const [newNote] = await db.insert(notes)
                            .values(note)
                            .returning();
  return newNote;
}

const getNotes = (type?: NoteTypeT): Promise<Note[]> => {
  const query = db.select().from(notes);
  return type 
            ? query.where(eq(notes.type, type)) 
            : query;
};

export { createNote, getNotes }