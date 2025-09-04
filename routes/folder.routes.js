import { Router } from 'express';
import {
  createFolder,
  deleteFolderById,
  EditFolders,
  getFolderById,
  getFolders,
} from '../controllers/folder.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';
import { getFilesAndNotes } from '../controllers/user.controller.js';

const foldersRoutes = Router();

foldersRoutes.get('/get-folders', authRequired, getFolders);
foldersRoutes.get('/get-folder-and-notes', authRequired, getFilesAndNotes);
foldersRoutes.get('/get-folder/:id', authRequired, getFolderById);

foldersRoutes.post('/edit-folders/:id', authRequired, EditFolders);
foldersRoutes.post('/delete-folder/:id', authRequired, deleteFolderById);
foldersRoutes.post('/create-folder', authRequired, createFolder);

export default foldersRoutes;
