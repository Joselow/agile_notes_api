import { Router } from "express";

import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteController.js";
import { authenticateToken, authRecordNotes } from "../middleware/auth.js";

const router = Router();

const NOTES_ROUTE_NAME = "notes";

router.get(`/${NOTES_ROUTE_NAME}`, authenticateToken, getNotes);

router.get(`/${NOTES_ROUTE_NAME}/public`, getNotes);

router.post(`/${NOTES_ROUTE_NAME}`, authRecordNotes, createNote);

router.put(`/${NOTES_ROUTE_NAME}/:id`, authRecordNotes, updateNote);

router.delete(`/${NOTES_ROUTE_NAME}/:id`, authRecordNotes, deleteNote);

export default router;