import { authRequired } from '../middleware/auth.middleware.js';
import {
  createNote,
  editNote,
  getAllNotes,
} from '../controllers/notes.controller.js';
import Router from 'express';

const notesRoutes = Router();

// Example: GET /notes/5  -> folderId = 5
notesRoutes.get('/get-notes/:folderId', authRequired, getAllNotes);
notesRoutes.post('/post-notes/:folder_id', authRequired, createNote);
notesRoutes.post('/edit-note/:note_id', authRequired, editNote);

export default notesRoutes;
