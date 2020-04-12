import { Router } from 'express';
import Index from "../controllers/indexController";

const indexRouter: Router = Router();

indexRouter.get('/', Index);

export default indexRouter;