import {AuthRequest} from "../utils/libTypes.js";
import {NextFunction, Response} from "express";
import {HttpError} from "../errorHandler/HttpError.js";

const userRequests: Record<number, { count: number; time: number }> = {};

const REQUEST_LIMIT = 5;
const WINDOW_TIME = 60 * 1000;

export const queryLimiter =
    (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.userId ? Number(req.userId) : null;

    const roles = req.roles!.map(r => r.toUpperCase());

    if (!userId || !roles.includes("USER")) {
        return next();
    }

    const now = Date.now();

    if (!userRequests[userId]) {
        userRequests[userId] = { count: 1, time: now };
        return next();
    }

    const userData = userRequests[userId];

    if (now - userData.time > WINDOW_TIME) {
        userRequests[userId] = { count: 1, time: now };
        return next();
    }

    userData.count++;

    if (userData.count > REQUEST_LIMIT) {
        // console.log(`User ${userId} exceeded the request limit: ${userData.count}`);
        throw new HttpError(403, "Requests per minute limit exceeded for USER");
    }
    next();
};