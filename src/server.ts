import express from 'express';
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";
import morgan from "morgan";
import * as fs from "node:fs";
import dotenv from "dotenv";


export const launchServer = () => {
    //===========load environments==============
    dotenv.config();
    const app = express();
    app.listen(process.env.PORT, () => console.log(`Server runs at http://localhost:${process.env.PORT}`));
    const logStream = fs.createWriteStream('access.log', {flags:'a'});
//==================Middleware================
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream:logStream}))
    // app.use((req: Request, res:Response, next:NextFunction) => next())
//==================Router====================
    app.use('/api', libRouter);
    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

//================ErrorHandler================
    app.use(errorHandler)
}