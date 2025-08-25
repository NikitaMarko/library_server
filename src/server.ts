import express, {Request,Response,NextFunction} from 'express';
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";
import morgan from "morgan";
import * as fs from "node:fs";
import dotenv from "dotenv";
import {accountRouter} from "./routes/accountRouter.js";
import {authentication, skipRoutes} from "./middleware/authentication.js";
import {accountServiceMongo} from "./services/AccountServiceImplMongo.js";
import {HttpError} from "./errorHandler/HttpError.js";
import {SKIP_ROUTES} from "./config/libConfig.js";


export const launchServer = () => {
    //===========load environments==============
    dotenv.config();
    const app = express();
    app.listen(process.env.PORT, () => console.log(`Server runs at http://localhost:${process.env.PORT}`));
    const logStream = fs.createWriteStream('access.log', {flags:'a'});
//==================Middleware================

    app.use(morgan('dev'));
    app.use(morgan('combined', {stream:logStream}))
    app.use(express.json());
    app.use(authentication(accountServiceMongo));
    app.use(skipRoutes(SKIP_ROUTES));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof HttpError) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send('Internal server error');
        }
    });
//==================Router====================
    app.use('/accounts', accountRouter)
    app.use('/api', libRouter);
    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

//================ErrorHandler================
    app.use(errorHandler)
}