
import express from 'express'
// import {bookRouterWithMongoDB} from "./bookRouterWithMongoDB.js";
import {bookRouter} from "./bookRouter.js";

export const libRouter = express.Router();

libRouter.use('/books', bookRouter);