import dotenv from "dotenv";
import mysql, {Pool} from 'mysql2/promise'
// @ts-ignore
import appConf from "../../app-config/app-config.json"


export interface AppConfig {
    port: number,
    skipRoutes:string[],
    pathRoles:Record<string, string[]>,
    checkIdRoutes:string[],
    pool:Pool,
    db:string

}

export const configuration:AppConfig ={
    ...appConf,
    pool:mysql.createPool({
        host:process.env.DB_HOST,
        port:+process.env.DB_PORT!,
        database:process.env.DB_NAME,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD
    }),
    db:process.env.db || "dev db address"
}