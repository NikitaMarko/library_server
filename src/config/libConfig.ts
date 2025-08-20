import dotenv from "dotenv";
import mysql from 'mysql2/promise'

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

