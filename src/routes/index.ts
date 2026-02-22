import { Router } from "express";
import { createNote, getNotes } from "../controllers/noteController.js";

const router = Router();

const NOTES_ROUTE_NAME = "notes";


router.get(`/${NOTES_ROUTE_NAME}`, getNotes);
router.post(`/${NOTES_ROUTE_NAME}`, createNote);


export default router;