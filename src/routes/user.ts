import { Router } from 'express';
import * as userController from "../controllers/userController";

const userRouter: Router = Router();

userRouter.post('/login', userController.login);
userRouter.get('/logout', userController.logout);

export default userRouter;