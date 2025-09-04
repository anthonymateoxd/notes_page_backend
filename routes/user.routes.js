import { Router } from 'express';
import {
  createUser,
  editUser,
  getUserById,
  // getUsers,
  loginUser,
  logout,
  verifyToken,
} from '../controllers/user.controller.js';
import { authRequired } from '../middleware/auth.middleware.js';

const userRouter = Router();

// userRouter.get('/users', getUsers);
userRouter.get('/user', authRequired, getUserById);
userRouter.post('/user', createUser);

userRouter.post('/login', loginUser);
userRouter.get('/verify', verifyToken);
userRouter.post('/logout', logout);
userRouter.post('/updated-user', authRequired, editUser);

export default userRouter;
