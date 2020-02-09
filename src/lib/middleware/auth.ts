import { Request, Response, NextFunction } from "express";
import User from "../../models/users";

const authMDW = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.admin) {
        User.findOne({_id: req.session.admin}, function(err, user){
            if (user){
                next();
            } else {
                res.status(401).json(
                    {
                        status: 0,
                        message: "Access denied",
                        code: "f0"
                    }
                );
            }
        });
    } else {
        res.status(401).json(
            {
                status: 0,
                message: "Access denied",
                code: "f0"
            }
        );
    }
}

export default authMDW