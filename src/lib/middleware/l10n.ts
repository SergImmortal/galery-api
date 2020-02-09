import { Request, Response, NextFunction } from "express";

const l10nMDW = (req: Request, res: Response, next: NextFunction) => {
    const supportedLanguales: Array<String> = ["UA", "EN"];
    let lang: String = "UA";
    if (req.query._lang && req.query._lang.length == 2) {
        lang = req.query._lang;
    } else {
        if (req.cookies.selectedLanguage) {
            if (supportedLanguales.indexOf(req.cookies.selectedLanguage) > -1) {
                lang = req.cookies.selectedLanguage;
            }
        }
    }
    res.locals.lang = lang;
    next();
}

export default l10nMDW