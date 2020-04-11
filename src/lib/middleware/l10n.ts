import { Request, Response, NextFunction } from "express";

const l10nMDW = (req: Request, res: Response, next: NextFunction) => {
    const supportedLanguages: Array<String> = ["UA", "EN"];
    let lang: string | any = "UA";
    if (req.query._lang && req.query._lang.length == 2) {
        lang = req.query._lang;
    } else {
        if (req.cookies.selectedLanguage) {
            if (supportedLanguages.indexOf(req.cookies.selectedLanguage) > -1) {
                lang = req.cookies.selectedLanguage;
            }
        }
    }
    res.locals.lang = lang;
    next();
};

export default l10nMDW