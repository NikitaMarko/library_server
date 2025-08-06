import {LibService} from "../services/libService.ts";
import {LibServiceImplEmbedded} from "../services/libServiceImplEmbedded.ts";
import {Request,Response} from "express";
import {Book, BookDto} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.ts";
import {convertBookDtoToBook} from "../utils/tools.js";
import {BookSchemas} from "../joiSchemas/bookSchema.js";

export class BookController {
    private libService: LibService = new LibServiceImplEmbedded();
    constructor() {
        this.getAllBooks = this.getAllBooks.bind(this);
        this.addBook = this.addBook.bind(this);
        this.removeBook = this.removeBook.bind(this);
    }

    getAllBooks(req:Request,res:Response){
        const result = this.libService.getAllBooks();
        res.json(result);
    }

    addBook(req:Request,res:Response){
        const dto = req.body as BookDto;
        const book:Book = convertBookDtoToBook(dto);
        const result = this.libService.addBook(book);
        if(result)
            res.status(201).json(book);
        else throw new HttpError(409, 'Book not added. Id conflict');
    }
    removeBook(req:Request,res:Response){
    const {error, value} = BookSchemas.validate(req.body);
        if(error) throw new HttpError(400,'Bad request');
        const book = value as Book;
        const isSuccess = this.libService.removeBook(book.id);
        if (isSuccess) {
            res.status(200).json(isSuccess)
            return;
        }
        throw new HttpError(404, 'User not found')
    }
}