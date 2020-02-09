import { Response, Request  } from "express";

export const index = (req: Request, res: Response) => {
    res.json(
        {
            status: 1,
            message: "Home",
            data: false
        }
    );
};