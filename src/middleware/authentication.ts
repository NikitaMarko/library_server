import {AccountService} from "../services/accountService.js";
import {NextFunction, Response} from "express";
import {checkReaderId} from "../utils/tools.js";
import bcrypt from "bcryptjs";
import {HttpError} from "../errorHandler/HttpError.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";


async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res:Response):Promise<boolean> {
    const BASIC = "Basic ";
    if (!authHeader || !authHeader.startsWith(BASIC)) {
        res.status(401).send("Unauthorized: missing or invalid auth header");
        return false;
    }
    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
    console.log(auth);
    try {
        const [id, password] = auth.split(":");
        const _id = checkReaderId(id);
        const account = await service.getAccount(_id);
        if (!(req.roles?.includes(Roles.USER) || req.roles?.includes(Roles.ADMIN))) {
            res.status(403).send("Forbidden");
            return false;
        }
        if (bcrypt.compareSync(password, account.passHash)) {
            req.userId = account._id;
            req.userName = account.userName;
            req.roles = req.roles || [Roles.GUEST];
            console.log("AUTHENTICATED")
            return true;
        }else {
            console.log("NOT AUTHENTICATED");
            res.status(401).send("");
            return false;
        }
    } catch (e) {
        console.log(e);
        res.status(401).send("")
        return false;
    }
}

export const authentication = (service: AccountService)=> {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const roleHeader = req.header('x-role');
        const authHeader = req.header('authorization');
        console.log('authHeader: ', authHeader);
        if(roleHeader && Object.values(Roles).includes(roleHeader as Roles)) {
            req.roles = [roleHeader as Roles];}
            else
            {
                req.roles = [Roles.GUEST]
            }

        if (req.roles?.includes(Roles.USER) || req.roles?.includes(Roles.ADMIN)) {
            const result = await getBasicAuth(authHeader || '', service, req, res)
            if (!result)
                return;
        }
        next();
    }
}

export const skipRoutes = (skipRoutes:string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path
        if(!skipRoutes.includes(route) && !req.userId)
            throw new HttpError(401, "");
        next();
}