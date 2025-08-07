import {Book, BookDto, BookGenres, BookStatus} from "../model/Book.ts";
import { v4 as uuidv4 } from 'uuid';
import {HttpError} from "../errorHandler/HttpError.js";
import {BookSchemas} from "../joiSchemas/bookSchema.js";

function getGenres(genre: string) {
    const bookGenre = Object.values(BookGenres).find(value => value===genre);
    if (!bookGenre) throw new HttpError(400, 'Wrong genre');
    else return bookGenre;
}

export const convertBookDtoToBook = (dto:BookDto) =>{
    return {
        id: uuidv4(),
        title: dto.title,
        author: dto.author,
        genre: getGenres(dto.genre),
        status: BookStatus.ON_STOCK,
        pickList:[]
    }
}
export function bookObjectValidate(
    book: Book | undefined,
) {
    if (!book) {
        throw new HttpError (400, "Body is required");
    }
    const {error} = BookSchemas.validate(book);
    if (error) {
        throw new HttpError (400, error.message);
    }
}