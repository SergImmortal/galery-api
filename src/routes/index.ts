import { Router } from 'express';
import * as indexController from "../controllers/indexController";

const indexRouter: Router = Router();

indexRouter.get('/', indexController.index);

export default indexRouter;