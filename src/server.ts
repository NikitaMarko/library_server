import express from 'express';
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";
import morgan from "morgan";
import * as fs from "node:fs";
import dotenv from "dotenv";
import {accountRouter} from "./routes/accountRouter.js";
import {accountServiceMongo} from "./services/AccountServiceImplMongo.js";
import {configuration} from "./config/libConfig.js";
import {authorize, checkAccountById} from "./middleware/authorization.js";
import {Roles} from "./utils/libTypes.js";
import {authenticate, skipRoutes} from "./middleware/authentication.js";
import {queryLimiter} from "./middleware/queryLimiter.js";



export const launchServer = () => {
    //===========load environments==============
    dotenv.config();
    const app = express();
    app.listen(configuration.port, () => console.log(`Server runs at http://localhost:${configuration.port}`));
    const logStream = fs.createWriteStream('access.log', {flags:'a'});
//==================Middleware================
    app.use(express.json());
    app.use(authenticate(accountServiceMongo));
    app.use(skipRoutes(configuration.skipRoutes));
    app.use(queryLimiter);
    app.use(checkAccountById(configuration.checkIdRoutes));
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream:logStream}))

//==================Router====================
    app.use('/accounts', accountRouter)
    app.use('/api', libRouter);
    app.use((req, res) => {
        res.status(404).send("Page not found")
    })
    app.use(authorize(configuration.pathRoles as Record<string, Roles[]>));

//================ErrorHandler================
    app.use(errorHandler)
}