import express, {Request, Response, NextFunction} from 'express';
import {db, PORT} from "./config/libConfig.ts";
import {libRouter} from "./routes/libRouter.ts";
import {errorHandler} from "./errorHandler/errorHandler.ts";
import morgan from "morgan";
import * as fs from "node:fs";
import * as mongoose from "mongoose";


export const launchServer = () => {
    const app = express();

    const logStream = fs.createWriteStream("access.log", { flags: "a" });


//===================Middleware================
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream: logStream}));
    // app.use((req:Request,res:Response,next:NextFunction)=>next());
//===================Router==========================
    app.use('/api',libRouter);

    app.use((req,res)=>{
       res.status(404).send('Page Not Found');
    })

//====================Error Handler=====================
app.use(errorHandler)

    mongoose.connect(db).then(()=>console.log('MongoDB Connected'));
    app.listen(PORT, () => console.log(`Server runs at http://localhost:${PORT}`));

}