import express from "express";
import {addBook, getAllBooks} from "../services/bookServiceForMongoDB.js";

export const bookRouterWithMongoDB = express.Router();

bookRouterWithMongoDB.post('/', async (req, res) => {
    try {
        const book = await addBook(req.body);
        res.status(201).json(book);
    } catch (e) {
        const error = e as Error;
        res.status(400).send(error.message);
    }
})
bookRouterWithMongoDB.get('/', async (req, res) => {
        const books = await getAllBooks();
        res.json(books);
})
