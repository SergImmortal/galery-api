import { Response, Request, response  } from "express";
import {Page} from "../models/pages";

export const index = async(req: Request, res: Response) => {
    let data: any = await Page.getPageData(req.originalUrl, res.locals.lang);
    
    res.json(
        {
            status: 1,
            data: data,
            message: "Admin dashboard"
        }
    );
};