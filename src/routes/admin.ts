import { Router } from 'express';
import * as adminController from "../controllers/adminController";
import * as pagesController from "../controllers/pagesController"

const adminRouter: Router = Router();

adminRouter.get('/', adminController.index);
adminRouter.get('/pages', pagesController.list);
adminRouter.post('/pages', pagesController.add);
adminRouter.put('/pages', pagesController.edit);
adminRouter.delete('/pages', () => {});

export default adminRouter;