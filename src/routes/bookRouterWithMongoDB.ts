import express from "express";
import {addBook, getAllBooks, getBookByGenre, removeBook} from "../services/bookServiceForMongoDB.js";

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
bookRouterWithMongoDB.delete('/', async (req, res) => {
    try {
        const {_id} = req.body;
        if (!_id || typeof _id !== 'string') {
           return res.status(400).send('Invalid id or id not type of string');
        }
        const book = await removeBook(_id);
        if(!book){
            return res.status(404).send('Book Not Found');
        }
        return res.json(book);
    } catch (e) {
        const error = e as Error;
        return res.status(400).send(error.message);
    }
})
bookRouterWithMongoDB.get('/genre', async (req, res) => {
    try {
        const {genre} = req.query;
        if (!genre || typeof genre !== 'string') {
            return res.status(400).send('Invalid genre');
        }
        const books = await getBookByGenre(genre);
        if (books.length === 0) {
            return res.status(404).send('No books found with that genre');
        }
        return res.json(books);
    } catch (e) {
        const error = e as Error;
        return res.status(400).send(error.message);
    }
})
