import { Response, Request  } from "express";

const Index = (req: Request, res: Response) => {
    res.json(
        {
            status: 1,
            message: "Home",
            data: false
        }
    );
};

export default Index;