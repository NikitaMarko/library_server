
/*
PATCH/accounts/password => Roles.USER
GET/accounts/readerId => Roles.USER, Roles.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {Response,NextFunction} from "express";
import {HttpError} from "../errorHandler/HttpError.js";


export const authorize = (arr:Record<string, Roles[]>)=>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.route.path
        const roles = req.roles;
        if(roles?.some(r=>arr[route].includes(r)))
        next();
        else throw new HttpError(403,'')

}