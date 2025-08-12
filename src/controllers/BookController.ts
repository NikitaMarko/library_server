import {LibService} from "../services/libService.ts";
import {LibServiceImplEmbedded as service} from "../services/libServiceImplEmbedded.ts";
import {Request,Response} from "express";
import {Book, BookDto, BookGenres, BookStatus} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.ts";
import {bookObjectValidate, convertBookDtoToBook} from "../utils/tools.js";
import {BookSchemas, GenreSchema, IdSchema} from "../joiSchemas/bookSchema.js";
import {LibServiceImplMongo} from "../services/libServiceImplMongo.js";

export class BookController {
    private libService: LibService = new LibServiceImplMongo();
    constructor() {
        this.getAllBooks = this.getAllBooks.bind(this);
        this.addBook = this.addBook.bind(this);
        this.removeBook = this.removeBook.bind(this);
        this.getBookByGenre = this.getBookByGenre.bind(this);
        this.pickUpBook = this.pickUpBook.bind(this);
        this.returnBook = this.returnBook.bind(this);
        this.getBooksByGenreAndStatus = this.getBooksByGenreAndStatus.bind(this);
    }

    async getAllBooks(req:Request,res:Response){
        const result = await this.libService.getAllBooks();
        res.json(result);
    }

    async addBook(req:Request,res:Response){
        const dto = req.body as BookDto;
        const book:Book = convertBookDtoToBook(dto);
        bookObjectValidate(book);
        const result = await this.libService.addBook(book);
        if(result)
            res.status(201).json(book);
        else throw new HttpError(409, 'Book not added. Id conflict');
    }

     async removeBook(req:Request,res:Response){
    const {error, value} = BookSchemas.validate(req.body);
        if(error) throw new HttpError(400,'Bad request');
        const book = value as Book;
        bookObjectValidate(book);
        const isSuccess = await this.libService.removeBook(book.id);
        if (isSuccess) {
            res.json(isSuccess)
            return;
        }
        throw new HttpError(404, 'Book not found')
    }

   async getBookByGenre(req:Request,res:Response){
        const{error, value} = GenreSchema.validate(req.query);
        if(error) throw new HttpError(400,'Bad request');
        const {genre} = value;
        const enumResult = (Object.values(BookGenres)as string[]).find(g=> g===genre);
        if(!enumResult){
            throw new HttpError(400,'Genre not found');
        }
        const isSuccess = await this.libService.getBooksByGenre(enumResult as BookGenres);
        if (!isSuccess || isSuccess.length === 0) {
            throw new HttpError(404, 'No books found for this genre');
        }
        res.status(200).json(isSuccess);
    }

    async pickUpBook(req: Request, res: Response) {
        const { id } = req.params;
        const { reader } = req.body;
        const {error} = IdSchema.validate(id)
        if (error) {
            throw new HttpError(400, 'Invalid book id');
        }
        if (!reader) {
            throw new HttpError(400, 'Reader is required');
        }

        await this.libService.pickUpBook(id, reader);
        res.status(200).json({ message: 'Book picked up successfully' });
        throw new HttpError(400, 'Failed to pick up the book');
        }

    async returnBook(req: Request, res: Response) {
        const { id } = req.params;
        const {error} = IdSchema.validate(id)
        if (error) {
        throw new HttpError(400, 'Invalid book id');
            }
       await this.libService.returnBook(id);
        res.status(200).json({ message: 'Book returned successfully' });
        }
        async getBooksByGenreAndStatus(req:Request,res:Response){
        const {genre, status} = req.query;
            const getGenre = (Object.values(BookGenres)as string[]).find(g=> g===genre);
            if (!getGenre) {
                throw new HttpError(400, 'Invalid genre');
            }
            const getStatus = (Object.values(BookStatus)as string[]).find(s=> s===status);
            if (!getStatus) {
                throw new HttpError(400, 'Invalid book status');
            }

            const result = await this.libService.getBooksByGenreAndStatus(getGenre as BookGenres, getStatus as BookStatus);
            res.json(result);
        }
}