import {AccountService} from "../services/accountService.js";
import {NextFunction, Request, Response} from "express";
import {checkReaderId} from "../utils/tools.js";
import bcrypt from "bcryptjs";
import {HttpError} from "../errorHandler/HttpError.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";


async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response) {
    const BASIC = "Basic ";
    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString('ascii');
    console.log(auth);
    try {
        const [id, password] = auth.split(':');
        const _id = checkReaderId(id)
        const account = await service.getAccount(_id);
        if (bcrypt.compareSync(password, account.passHash)) {
            req.userId = account._id;
            req.userName = account.userName;
            req.roles = [Roles.USER]
            console.log('Authenticated');
        } else {
            console.log('Not authenticated');
            res.status(401).send('');

        }
    } catch (e) {
        console.log(e)
        res.status(401).send('');
    }
}

export const authentication = (service:AccountService)=>{
    return  async (req: AuthRequest, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        console.log("authHeader -", authHeader);
        if (authHeader) {
            await getBasicAuth(authHeader, service, req, res);
            if (req.userId) {
                return next();
        }else {
            return }
        }else {
            return res.status(401).send('Not authenticated');
        }
    }
}

export const skipRoutes = (skipRoutes:string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path
        if(!skipRoutes.includes(route) && !req.userId)
            throw new HttpError(401, "");
        next();

}