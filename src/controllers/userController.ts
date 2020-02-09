import { Response, Request } from "express";
import { check, sanitize, validationResult } from "express-validator";
import User, { UserDocument } from "../models/users";
import { config } from '../lib/config';

// TODO: remove
export const getLogin = (req: Request, res: Response) => {
    res.json({
        status: 1,
        message: "Login",
        data: false
    });
};

export const postLogin = async (req: Request, res: Response) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.json(
            {
                status: 0,
                message: errors['errors'].map(function(value: any) {
                    return value['msg'];
                    }
                ),
                code: 'f1'
            }
        );
    } else {
        User.findOne({ email: req.body.email }, function(err, user:UserDocument){
            if (err) {
                res.status(422).json(
                    {
                        status: 0,
                        errors: [err.message],
                        code: "f1"
                    }
                );
            } else {
                if (user) {
                    if(user.validPassword(req.body.password)) {
                       
                        req.session[user.role] = user._id;
                        if (req.body.remember) {
                            req.session.cookie.maxAge = 60 * 60 * 24 * 30 *1000;
                        } else {
                            req.session.cookie.maxAge = 60 * 15 *1000;
                        }
                        res.json(
                            {
                                status: 1,
                                message: "User logged.",
                                data: false
                            }
                        );
                    } else {
                        res.status(401).json({
                            status: 0,
                            message: ["Incorrect login or password"],
                            code: "f3"
                        });
                    }
                } else {
                    res.status(401).json({
                        status: 0,
                        message: ["Incorrect login or password"],
                        code: "f3"
                    }); 
                }
            }
        });
    }
};

export const addDefaultUser = (req: Request, res: Response) => {
    
    User.findOne({ email: config.baseUser.email }, function(err, user) {
        if (err) {
            res.status(422).json(
                {
                    status: 0,
                    message: [err.message],
                    code: 'f1'
                }
            )
        } else {
            if (user === null) {
                const user = new User(
                    {
                        email: config.baseUser.email,
                        password: config.baseUser.password,
                        role: config.baseUser.role
                    }
                ) as UserDocument;
            
                user.save(function(err) {
                    if (err) {
                        res.status(422).json(
                            {
                                status: 0,
                                message: [err.message],
                                code: "f1"
                            }
                        );
                    } else {
                        res.json(
                            {
                                status: 1,
                                message: "Successful created.",
                                data: false
                            }
                        );
                    }
                });
            } else {
                res.status(422).json(
                    {
                        status: 0,
                        message: ["User alredy created"],
                        code: "f4"
                    }
                );
            }
        };
    }); 
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy(function(err) {
        res.status(422).json(
            {
                status: 0,
                message: [err.message],
                code: "f5"
            }
        );
     });
    res.json(
        {
            status: 1,
            message: "Successful logaout.",
            data: false
        }
    );
}