import dotenv from "dotenv";
import mysql from 'mysql2/promise'
import {Roles} from "../utils/libTypes.js";

export const PORT = 3023;
export const db = 'mongodb+srv://NikitaMarkovskii:QqrMHqGXXWRaGe5H@cluster-java-27-30.cttizwq.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster-Java-27-30';


dotenv.config();
//==============================mySQL Connection=========================
export const pool = mysql.createPool({
    host:process.env.DB_HOST,
    port:+process.env.DB_PORT!,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD
})

export const SKIP_ROUTES = [
    "POST/accounts"
]
export const  access: Record<string, Roles[]> = {
    'GET/reader/:id': [Roles.USER, Roles.ADMIN],
    'POST/': [Roles.USER, Roles.ADMIN],
    'PATCH/password': [Roles.USER],
    'PATCH/email-name-birthdate': [Roles.USER, Roles.ADMIN],
    'DELETE/:id': [Roles.ADMIN],
    'GET/': [Roles.ADMIN]
};

