import dotenv from "dotenv";
import mysql, {Pool} from 'mysql2/promise'

import appConf from "../../app-config/app-config.json" with { type: 'json' };


export interface AppConfig {
    port: number,
    skipRoutes:string[],
    pathRoles:Record<string, string[]>,
    checkIdRoutes:string[],
    pool:Pool,
    db:string,
    jwt:{
        secret:string,
        exp:string|number
    }

}

dotenv.config();

export const configuration:AppConfig ={
    ...appConf,
    pool:mysql.createPool({
        host:process.env.DB_HOST,
        port:+process.env.DB_PORT!,
        database:process.env.DB_NAME,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD
    }),
    db:process.env.db || "dev db address",
    jwt:{
        secret:process.env.JWT_SECRET || "super-secret",
        exp:process.env.JWT_EXP || "1h"
    }
}