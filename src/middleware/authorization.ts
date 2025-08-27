
/*
PATCH/accounts/password => Roles.USER
GET/accounts/readerId => Roles.USER, Roles.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {Response,NextFunction} from "express";
import {HttpError} from "../errorHandler/HttpError.js";
import {PATH_ROUTES} from "../config/libConfig.js";


export const authorize = (pathRoute:Record<string, Roles[]>)=>
    (req:AuthRequest, res:Response, next:NextFunction)=> {
            const route = req.method + req.path
            const roles = req.roles;
            const matchedKey = Object.keys(pathRoute).find(key => matchRoute(route, key));
            if (!matchedKey) throw new HttpError(403, "Route not allowed");

            if (!roles || roles.some(r => pathRoute[matchedKey].includes(r))) {
                    next();
            } else throw new HttpError(403, "");
    };
    //         if(!roles || roles.some(r => pathRoute[route].includes(r))){
    //                 console.log("authorize")
    //                 next();
    //         }
    //
    //         else throw new HttpError(403, "")
    // }


export  const checkAccountById = (checkPathId:string[]) => {
        return (req:AuthRequest, res:Response, next:NextFunction)=> {
                const route = req.method + req.path;
                const roles = req.roles;
                if(!roles || !checkPathId.includes(route) || (!req.roles!.includes(Roles.ADMIN)
                    && req.roles!.includes(Roles.USER)
                    && req.userId == req.query.id))
                        next();
                else throw new HttpError(403, "You can modify only your own account")
        }
}
function matchRoute(route: string, pattern: string): boolean {
        const routeParts = route.split("/");
        const patternParts = pattern.split("/");

        if (routeParts.length !== patternParts.length) return false;

        return patternParts.every((part, i) => part.startsWith(":") || part === routeParts[i]);
}