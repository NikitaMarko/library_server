import {Response, Request} from "express";
//import {libServiceEmbedded as service} from "../services/libServiceImplEmbedded.js";
import {Book, BookDto} from "../model/Book.js";
import {convertBookDtoToBook, getGenres, getStatus} from "../utils/tools.js";
import {HttpError} from "../errorHandler/HttpError.js";
//import {libServiceMongo as service} from "../services/libServiceImplMongo.js";
import {libServiceSql as service} from '../services/libServiceImplSQL.js';

export const getBooksByGenreAndStatus = async (req: Request, res: Response) => {
    const {genre, status} = req.query;
    const genre_upd = getGenres(genre as string);
    const status_upd = getStatus(status as string);
    //const result = await service.getBooksByGenreAndStatus(genre_upd, status_upd);
   // res.json(result);
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
    const {id, reader} = req.query;
    await service.pickUpBook(id as string, reader as string);
    res.send(`Book picked by ${reader}`)
}


export const addBook = async (req: Request, res: Response) => {
    const dto = req.body as BookDto;
    const book: Book = convertBookDtoToBook(dto);
    const result = await service.addBook(book);
    console.log(result)
    if (result)
        res.status(201).send("Book successfully added")
    else throw new HttpError(409, 'Book not added. Id conflict')
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

