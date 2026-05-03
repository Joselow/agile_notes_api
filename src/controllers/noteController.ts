import type { Request, Response } from "express";

import {
  createNote as createNoteService,
  getNotes as getNotesService,
  getNoteByIdForUser,
  updateNoteById,
  deleteNoteById,
} from "../services/noteService.js";
import { NOTE_TYPE, NOTE_TYPE_OPTIONS, type NoteTypeT } from "../constants/noteType.js";
import {
  isTaskCategory,
  normalizeCategory,
  type NoteCategoryKey,
} from "../constants/noteCategory.js";
import { simpleSuccess, success } from "../utils/responses.js";
import { catchErrors } from "../utils/catchErrors.js";
import { NotFoundError404 } from "../errors/NotFoundError404.js";
import { InternalServerError505 } from "../errors/InternalServerError505.js";
import { BadRequestError400 } from "../errors/BadRequestError400.js";

function resolveUserId(req: Request): number {
  if (req.user?.id != null) return req.user.id;
  const d = process.env.DEFAULT_USER_ID;
  if (!d) {
    throw new InternalServerError505("User not provided");
  }
  return Number(d);
}

export const createNote = catchErrors(async (req: Request, res: Response) => {
  const { type, content, category, is_completed, origin } = req.body;

  if (!type || content === undefined || content === "") {
    throw new BadRequestError400("Type and content are required");
  }

  if (!NOTE_TYPE_OPTIONS.includes(type)) {
    throw new BadRequestError400(
      "Invalid note type, the options are: " + NOTE_TYPE_OPTIONS.join(", "),
    );
  }

  const noteType = NOTE_TYPE[type as NoteTypeT];
  const defaultUserId = process.env.DEFAULT_USER_ID;

  if (!defaultUserId) {
    throw new InternalServerError505("User not provided");
  }

  const cat = normalizeCategory(category);
  const completed = isTaskCategory(cat) ? Boolean(is_completed) : false;
  const originVal =
    typeof origin === "string" && origin.trim()
      ? origin.trim().slice(0, 30)
      : "whatsapp";

  await createNoteService({
    user_id: Number(defaultUserId),
    type: noteType.id,
    content: String(content),
    category: cat,
    is_completed: completed,
    origin: originVal,
  });

  success(res, 201, {
    message: "Note created successfully",
  });
});

export const getNotes = catchErrors(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { type, date_start, date_end } = req.query;

  if (type && !NOTE_TYPE_OPTIONS.includes(type as string)) {
    throw new BadRequestError400(
      "Invalid note type, the options are: " + NOTE_TYPE_OPTIONS.join(", "),
    );
  }

  if (date_start && date_end && String(date_start) > String(date_end)) {
    throw new BadRequestError400("date_start must be before or equal to date_end");
  }

  const notes = await getNotesService(
    userId,
    type as NoteTypeT | undefined,
    date_start as string | undefined,
    date_end as string | undefined,
  );
  simpleSuccess(res, 200, notes);
});

export const updateNote = catchErrors(async (req: Request, res: Response) => {
  const userId = resolveUserId(req);
  const id = req.params.id;
  if (!id) {
    throw new BadRequestError400("Note id is required");
  }
  const { content, is_completed, category } = req.body;

  const existing = await getNoteByIdForUser(id, userId);
  if (!existing) {
    throw new NotFoundError404("Note not found");
  }

  const patch: {
    content?: string;
    is_completed?: boolean;
    category?: NoteCategoryKey;
  } = {};

  if (content !== undefined) {
    if (typeof content !== "string") {
      throw new BadRequestError400("content must be a string");
    }
    patch.content = content;
  }

  let effectiveCategory = normalizeCategory(existing.category);
  if (category !== undefined) {
    if (typeof category !== "string") {
      throw new BadRequestError400("category must be a string");
    }
    effectiveCategory = normalizeCategory(category);
    patch.category = effectiveCategory;
    if (!isTaskCategory(effectiveCategory)) {
      patch.is_completed = false;
    }
  }

  if (is_completed !== undefined) {
    const catForCompleted = patch.category ?? effectiveCategory;
    if (!isTaskCategory(catForCompleted)) {
      throw new BadRequestError400("is_completed only applies to task notes");
    }
    patch.is_completed = Boolean(is_completed);
  }

  if (Object.keys(patch).length === 0) {
    simpleSuccess(res, 200, existing);
    return;
  }

  const updated = await updateNoteById(id, userId, patch);
  if (!updated) {
    throw new NotFoundError404("Note not found");
  }
  simpleSuccess(res, 200, updated);
});

export const deleteNote = catchErrors(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new BadRequestError400("Note id is required");
  }
  await deleteNoteById(id);
  simpleSuccess(res, 200, { message: "Note deleted successfully" });
});