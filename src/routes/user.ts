import { Router } from 'express';
import * as userController from "../controllers/userController";

const userRouter: Router = Router();

userRouter.get('/login', userController.getLogin);
userRouter.post('/login', userController.postLogin);
userRouter.get('/addDefaultUser', userController.addDefaultUser);
userRouter.get('/logout', userController.logout)

export default userRouter;