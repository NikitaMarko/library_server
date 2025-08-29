import express from 'express'
import {bodyValidation} from "../validation/bodyValidation.js";
import {BookDtoSchema} from "../validation/joiSchema.js";
import * as controller from "../controllers/bookControllerFunc.js"
export const bookRouter = express.Router();



bookRouter.get('/', controller.getAllBooks);
bookRouter.post('/', bodyValidation(BookDtoSchema), controller.addBook)
bookRouter.delete('/', controller.removeBook)
bookRouter.put('/pickup/:id', controller.pickUpBook)
bookRouter.put('/returnBook/:id', controller.returnBook)
bookRouter.get('/genre', controller.getBooksByGenre)
bookRouter.get('/genre_status', controller.getBooksByGenreAndStatus)
bookRouter.get('/books_reader', controller.getBooksByReaderId);
bookRouter.get('/books_title_author_genre', controller.getBooksByTitlesAuthorAndGenre);
bookRouter.get('/:id', controller.getBookById)

