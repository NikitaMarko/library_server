import {Book, BookGenres, BookStatus} from "../model/Book.ts";
import {Reader} from "../model/Reader.js";

export interface LibService {
    addBook: (book: Book) => Promise<boolean>;
    removeBook: (id:string) => Promise<Book>;
    pickUpBook: (id: string, reader: Reader) => Promise<void>;
    returnBook: (id: string) => Promise<void>;
    getAllBooks:() => Promise<Book[]>;
    getBookById:(id:string) => Promise<Book>;
    getBooksByGenre:(genre:BookGenres) => Promise<Book[]>
    getBooksByGenreAndStatus:(genre:BookGenres, status: BookStatus) => Promise<Book[]>
    getBooksByReaderId:(readerId:number) => Promise<Book[]>
}