/*
PATCH/accounts/password => Roles.USER,
GET/accounts/reader_id => ROLES.USER, ROLES.ADMIN
 */

import {AuthRequest, Roles} from "../utils/libTypes.js";
import {NextFunction, RequestHandler} from "express";
import {HttpError} from "../errorHandler/HttpError.js";

export const authorize = (pathRoles: Record<string, Roles[]>): RequestHandler => {
    return (req, res, next) => {
        const authReq = req as AuthRequest;
        const roles = authReq.roles;

        const routePath = req.route?.path;
        const routeKey = req.method + req.baseUrl + (routePath || req.path);

        console.log("REQ:", routeKey);
        console.log("ROLES:", roles);
        console.log("MATCHED ROLES:", pathRoles[routeKey]);

        if (!roles || !Array.isArray(roles) || !pathRoles[routeKey]?.some(r => roles.includes(r))) {
            throw new HttpError(403, "Forbidden");
        }

        next();
    };
};

    export  const checkAccountById = (checkPathId:string[]): RequestHandler => {
        return (req, res, next)=> {
            const authReq = req as AuthRequest;
            const route = authReq.method + authReq.path;
            const roles = authReq.roles;
            if(!roles || !checkPathId.includes(route) || (!roles!.includes(Roles.ADMIN)
                && roles!.includes(Roles.USER)
                && authReq.userId == authReq.body.id))
                next();
            else throw new HttpError(403, "You can modify only your own account")
        }
    }