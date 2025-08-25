import {AccountService} from "../services/accountService.js";
import {NextFunction, Response} from "express";
import bcrypt from "bcryptjs";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {SKIP_ROUTES} from "../config/libConfig.js";
import {checkReaderId} from "../utils/tools.js";


export async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response): Promise<boolean> {
    const BASIC = "Basic ";

    if (!authHeader || !authHeader.startsWith(BASIC)) {
        res.status(401).send("");
        return false;
    }

    try {
        const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
        const [id, password] = auth.split(":");

        const _id = checkReaderId(id);
        const account = await service.getAccount(_id);
        if (!account) {
            res.status(404).send("Account not found");
            return false;
        }

        if (!(req.roles?.includes(Roles.USER) || req.roles?.includes(Roles.ADMIN))) {
            res.status(403).send("");
            return false;
        }

        if (bcrypt.compareSync(password, account.passHash)) {
            req.userId = account._id;
            req.userName = account.userName;
            req.roles = req.roles || [Roles.GUEST];
            return true;
        } else {
            res.status(401).send("");
            return false;
        }
    } catch (err) {
        console.error(err);
        res.status(401).send("");
        return false;
    }
}

export const authentication = (service: AccountService) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path;
        if (SKIP_ROUTES.includes(route)) {
            req.roles = [Roles.GUEST];
            return next();
        }

        const roleHeader = req.header("x-role");
        const authHeader = req.header("authorization");

        if (roleHeader && Object.values(Roles).includes(roleHeader as Roles)) {
            req.roles = [roleHeader as Roles];
        } else {
            req.roles = [Roles.GUEST];
        }

        if (authHeader && authHeader.startsWith("Basic ")) {
            const ok = await getBasicAuth(authHeader, service, req, res);
            if (!ok) return;
        }
        return next();
    };
};
export const skipRoutes = (skipRoutes: string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path;

        if (skipRoutes.includes(route)) {
            return next();
        }
        if (req.userId) {
            return next();
        }
        res.status(401).send("");
    };