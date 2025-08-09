
import express from 'express'
// import {bookRouter} from "./bookRouter.ts";
import {bookRouterWithMongoDB} from "./bookRouterWithMongoDB.js";

export const libRouter = express.Router();

libRouter.use('/books', bookRouterWithMongoDB);