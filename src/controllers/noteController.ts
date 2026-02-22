import { Request, Response } from "express";

import { createNote as createNoteService, getNotes as getNotesService } from "../services/noteService";
import { NOTE_TYPE, NOTE_TYPE_OPTIONS, type NoteTypeT } from "../constants/noteType";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { type, content } = req.body;

    if (!NOTE_TYPE_OPTIONS.includes(type)) {
      return res.json({
        success: false,
        message: 'Invalid note type'+ ', the options are: ' + NOTE_TYPE_OPTIONS.join(', ') ,
      });
    }

    const noteType = NOTE_TYPE[type as NoteTypeT];

    createNoteService ({
      user_id: 1,
      type: noteType.id,
      content,
    });
   
    return res.json({
      success: true,
      message: 'Note created successfully',
    });
  } catch (error) {
    return res.json({
      success: false,
      message: 'Error creating note',
    });
  }
}

export const getNotes = async (req: Request, res: Response) => {
    try {
      const notes = await getNotesService();
      return res.json({
        success: true,
        data: notes,
        message: 'Notes retrieved successfully',
      }); 
    } catch (error) {
      return res.json({
        success: false,
        message: 'Error getting notes',
      }); 
    }
}