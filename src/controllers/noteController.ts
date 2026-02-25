import type { Request, Response } from "express";

import { createNote as createNoteService, getNotes as getNotesService } from "../services/noteService.js";
import { NOTE_TYPE, NOTE_TYPE_OPTIONS, type NoteTypeT } from "../constants/noteType.js";
import { simpleSuccess, success } from "../utils/responses.js";
import { catchErrors } from "../utils/catchErrors.js";
import { NotFoundError404 } from "../errors/NotFoundError404.js";
import { InternalServerError505 } from "../errors/InternalServerError505.js";
import { BadRequestError400 } from "../errors/BadRequestError400.js";

export const createNote = catchErrors(async (req: Request, res: Response) => {
  const { type, content } = req.body;

  if (!type || !content) {
    throw new BadRequestError400('Type and content are required');
  }

  if (!NOTE_TYPE_OPTIONS.includes(type)) {
      throw new BadRequestError400('Invalid note type'+ ', the options are: ' + NOTE_TYPE_OPTIONS.join(', '));
  }

  const noteType = NOTE_TYPE[type as NoteTypeT];
  const defaultUserId = process.env.DEFAULT_USER_ID;

  console.log({defaultUserId});
  
  if (!defaultUserId) {
    throw new InternalServerError505('User not provided');
  }

  await createNoteService ({
    user_id: Number(defaultUserId),
    type: noteType.id,
    content,
  });

  success(res, 201, {
    message: 'Note created successfully',
  })
})

export const getNotes = catchErrors(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { type, date } = req.query;

  console.log({type, date});

   if (type && !NOTE_TYPE_OPTIONS.includes(type as string)) {
    throw new BadRequestError400('Invalid note type'+ ', the options are: ' + NOTE_TYPE_OPTIONS.join(', '));
  }

  const notes = await getNotesService(userId, type as NoteTypeT, date as string);
  simpleSuccess(res, 200, notes);
})