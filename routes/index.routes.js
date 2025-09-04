import foldersRoutes from './folder.routes.js';
import notesRoutes from './notes.routes.js';
import userRouter from './user.routes.js';
import { Router } from 'express';

const routes = Router();

routes.use('/', userRouter);
routes.use('/', foldersRoutes);
routes.use('/', notesRoutes);

export default routes;
