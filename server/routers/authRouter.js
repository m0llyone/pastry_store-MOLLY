import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

export const authRouter = new Router();

authRouter.get('/users', UserController.getUsers);
authRouter.get('/users/:id', UserController.getUser);
authRouter.post('/users', UserController.registration);
authRouter.post(
  '/registration',
  [
    check('email', 'Enter a email').trim().notEmpty(),
    check('password', 'Password must be more then 5 and less then 20 symbols').isLength({
      min: 5,
      max: 20,
    }),
  ],
  UserController.registration,
);
authRouter.post('/login', UserController.login);
authRouter.get('/auth', authMiddleware, UserController.auth);
authRouter.delete('/users/:id', UserController.deleteUser);
authRouter.put('/users/:id', UserController.editUser);
