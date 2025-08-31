import {Response, Request, NextFunction} from "express";
//import {libServiceEmbedded as service} from "../services/libServiceImplEmbedded.js";
import {Book, BookDto} from "../model/Book.js";
import {convertBookDtoToBook, getGenres, getStatus} from "../utils/tools.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {libServiceImplMongo as service} from "../services/libServiceImplMongo.js";
import {accountServiceMongo as acc_service, filterBookByReaderId} from "../services/AccountServiceImplMongo.ts"

export const getBooksByGenreAndStatus = async (req: Request, res: Response) => {
    const {genre, status} = req.query;
    const genre_upd = getGenres(genre as string);
    const status_upd = getStatus(status as string);
    const result = await service.getBooksByGenreAndStatus(genre_upd, status_upd);
    res.json(result);
}

export const getBooksByGenre = async (req: Request, res: Response) => {
    const {genre} = req.query;
    const genre_upd = getGenres(genre as string);
    const result = await service.getBooksByGenre(genre_upd);
    res.json(result);
}


export const returnBook = async (req: Request, res: Response) => {
    const {id} = req.query;
    await service.returnBook(id as string);
    res.send("Book returned")
}


export const pickUpBook = async (req: Request, res: Response) => {
    const { readerId } = req.query;
    const { id } = req.params;

    const reader = await acc_service.getAccountById(parseInt(readerId as string));
    await service.pickUpBook(id, reader);
    res.send(`Book picked by ${reader.userName}`);
}



export const addBook = async (req: Request, res: Response) => {
    const dto = req.body as BookDto;
    const book: Book = convertBookDtoToBook(dto);
    const result = await service.addBook(book);
    if (result)
        res.status(201).send("Book successfully added")
    else throw new HttpError(409, 'Book not added')
}

export const getAllBooks =async (req: Request, res: Response) => {
    const result = await service.getAllBooks();
    res.json(result);
}

export const removeBook = async (req: Request, res: Response) => {
    const {id} = req.query;
    const result = await service.removeBook(id as string);
    res.json(result);
}
export const getBooksByReaderId = async (req: Request, res: Response) => {
    const { readerId } = req.query;
    const id = Number(readerId);
    await acc_service.getAccountById(id);
    const result = await service.getBooksByReaderId(id);
    res.json(result);
}

export async function getBooksByTitlesAuthorAndGenre(req: Request, res: Response, next: NextFunction) {
    try {
        const readerIdRaw = req.query.readerId;
        if (!readerIdRaw) return res.status(400).json({ message: "readerId is required" });

        const readerId = Number(readerIdRaw);
        if (Number.isNaN(readerId)) return res.status(400).json({ message: "readerId must be a number" });

        const books = await filterBookByReaderId(readerId);
        res.json(books);
    } catch (err) {
        next(err);
    }
}

export const getBookById = async (req: Request, res: Response) => {
    const {id} = req.query;
    const result = await service.getBookById(id as string);
    res.json(result);
}

