import express from 'express'
import {BookController} from "../controllers/BookController.js";
import {bodyValidation} from "../validation/bodyValidation.js";
import {BookDtoSchema} from "../joiSchemas/bookSchema.js";

export const bookRouter = express.Router();

const controller = new BookController();

bookRouter.get('/', controller.getAllBooks);
// bookRouter.post('/', bodyValidator(BookDtoJoiSchema), controller.addBook)
bookRouter.post('/', bodyValidation(BookDtoSchema), controller.addBook)
bookRouter.delete('/', controller.removeBook)
bookRouter.get('/genre', controller.getBookByGenre)
bookRouter.put('/pickup/:id', controller.pickUpBook)
bookRouter.put('/returnBook/:id', controller.returnBook)