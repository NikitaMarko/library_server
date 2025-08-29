import {AccountService} from "../services/accountService.js";
import {NextFunction, Request, Response} from "express";
import {checkReaderId} from "../utils/tools.js";
import bcrypt from "bcryptjs";
import {HttpError} from "../errorHandler/HttpError.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";


async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response) {
    const BASIC = "Basic ";
    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
    console.log(auth);

    const [id, password] = auth.split(":");
    const _id = checkReaderId(id);
    console.log(process.env.OWNER!)
    console.log(process.env.OWNER_PASS)
    if (_id == (+process.env.OWNER!) && password === process.env.OWNER_PASS) {
        req.userId = 10000000;
        req.roles = [Roles.SUPERVISOR];
    } else {
        try {
            const account = await service.getAccountById(_id);
            if (bcrypt.compareSync(password, account.passHash)) {
                req.userId = account._id;
                req.userName = account.userName;
                req.roles = account.roles;
                console.log("AUTHENTICATED")
            } else {
                console.log("NOT AUTHENTICATED")

            }
        } catch (e) {
            console.log("NOT AUTHENTICATED because Internal Http Errors")
        }
    }
}

export const authenticate = (service: AccountService) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.header('Authorization');
            if (authHeader)
                await getBasicAuth(authHeader, service, req, res)
            next();
        }
    }



export const skipRoutes = (skipRoutes: string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path //   POST/accounts
        if (!skipRoutes.includes(route) && !req.userId)
            throw new HttpError(401, "skipRoutes sent throw this error");

        next();
    }