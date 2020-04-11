import { Response, Request } from "express";
import { check, sanitize, validationResult } from "express-validator";

// TODO: rewrite to JWT
export const postLogin = async (req: Request, res: Response) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);
};

export const logout = (req: Request, res: Response) => {

};

export const role = (req: Request, res: Response) => {

};