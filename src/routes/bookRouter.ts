import express from 'express'
import {BookController} from "../controllers/BookController.js";

export const bookRouter = express.Router();

const controller = new BookController();

bookRouter.get('/', controller.getAllBooks);
// bookRouter.post('/', bodyValidator(BookDtoJoiSchema), controller.addBook)
bookRouter.post('/', controller.addBook)
bookRouter.delete('/', controller.removeBook)
bookRouter.get('/genre', controller.getBookByGenre)