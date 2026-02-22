import { Router } from "express";
import { createNote, getNotes } from "../controllers/notesController";

const router = Router();

const NOTES_ROUTE_NAME = "notes";


router.get(`/${NOTES_ROUTE_NAME}`, getNotes);
router.post(`/${NOTES_ROUTE_NAME}`, createNote);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Notes API',
    version: '1.0.0',
  });
});


export default router;