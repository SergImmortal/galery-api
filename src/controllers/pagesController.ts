import { Response, Request } from "express";
import { check, sanitize, validationResult } from "express-validator";
import {Page, PageDocument} from "../models/pages";

export const list = (req: Request, res: Response) => {
    if (req.query.action === "list") {
        const query = Page.find({lang: res.locals.lang}, {path: 1, _id: 1});
        query.exec(function (err, docs) {
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
                        message: "Success.",
                        data: docs
                    }
                ); 
            }
        });    
    } else if (req.query.action === "id" && req.query.id) {
        const query = Page.findById(req.query.id, 'path title lang data meta updated_at -_id');
        query.exec(function (err, docs) {
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
                        message: "Success.",
                        data: docs
                    }
                ); 
            }
        });
    } else {
        res.status(422).json(
            {
                status: 0,
                message: ["Wrong parameter 'action'."],
                code: "f2"
            }
        );
    }
}

export const add = async(req: Request, res: Response) => {
    await check("path", "Path can't be blank").isLength({min: 1}).run(req);
    await check("title", "Title can't be blank").isLength({min: 1}).run(req);
    await check("data", "Page content can't be blank").isLength({min: 1}).run(req);
    await check("lang", "Content language can't be blank").isLength({min: 1}).run(req);

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        res.status(422).json(
            {
                status: 0,
                message: errors['errors'].map(function(value: any) {
                    return value['msg'];
                }),
                code: "f3"
            }
        );
    } else {
        let data: any = {
            path: req.body.path,
            title: req.body.title,
            lang: req.body.lang.toUpperCase(),
            data: JSON.parse(req.body.data)
        }
        if (req.body.meta) {data.meta = req.body.meta};
        const page = new Page(data) as PageDocument;
        page.save(function(err){
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
                        message: "Successfuly added.",
                        data: false
                    }
                ); 
            }
        });
    }
}

export const edit = (req: Request, res: Response) => {
    if (req.query.id) {
        Page.findById(req.query.id, function (err, doc: PageDocument) {
            if (err) {
                res.status(422).json(
                    {
                        "status": 0,
                        "message": [err.message],
                        "code": "f1"
                    }
                );
            } else {
                doc.path = req.body.path;
                doc.title = req.body.title;
                doc.data = JSON.parse(req.body.data);
                doc.lang = req.body.lang;
                if (req.body.meta) {
                    doc.meta = req.body.meta;
                }
                doc.save((err, doc)=> {
                    if (err) {
                        res.status(422).json(
                            {
                                "status": 0,
                                "message": [err.message],
                                "code": "f1"
                            }
                        );
                    } else {
                    res.json(
                        {
                            status: 1,
                            message: "Success.",
                            data: doc
                        }
                    );
                    }
                });
            }
          });
    } else {
        res.status(422).json(
            {
                status: 0,
                message: ["Wrong parameter 'id'."],
                code: "f2"
            }
        );
    }
} 

export const delet = (req: Request, res: Response) => {
    if (req.query.id) {
        let id: String = req.query.id;
        const query = Page.findByIdAndRemove(id);
        query.exec(function (err, docs) {
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
                        message: "Success.",
                        data: docs
                    }
                ); 
            }
        });    
    } else {
        res.status(422).json(
            {
                status: 0,
                message: ["Wrong parameter 'id'."],
                code: "f2"
            }
        );
    }
}