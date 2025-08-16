import {LibService} from "./libService.ts";
import {Book, BookGenres, BookStatus} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.js";
import {BookMongooseModel} from "../model/BookMongooseModel.js";

export class LibServiceImplEmbedded implements LibService{
    private books: Book[] = [];

    async addBook(book: Book): Promise <boolean> {
    const index = this.books.findIndex(item => item.id === book.id);
    if(index === -1) {
        this.books.push(book);
    return new Promise(resolve => resolve(true));
    }
        return Promise.resolve(true);
    }

    async getAllBooks(): Promise<Book[]> {
        return [...this.books];
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const genres = this.books.filter(item => item.genre.toLowerCase() === genre.toLowerCase());
        return genres as Book[];
    }

    async pickUpBook(id: string, reader: string): Promise<void> {
        const book = this.books.find(b => b.id === id);
        if (!book) {
            throw new HttpError(404,`Book with id ${id} not found`);
        }
        if (book.status !== BookStatus.ON_STOCK) {
            throw new HttpError(404, 'The book is in the hands of readers');
        }

        book.status = BookStatus.ON_HAND;
        const now = new Date().toISOString();

        book.pickList.push({
            reader,
            pick_date: now,
            return_date: null
        });
    }

    async removeBook(id: string): Promise<Book|null> {
    const indexBook = this.books.findIndex(item => item.id === id);
    if(indexBook !== -1) {
        const [deletedBook] = this.books.splice(indexBook, 1);
        return deletedBook;
    }
    return null;
    }

    async returnBook(id: string): Promise<void> {
        const book = this.books.find(b => b.id === id);
        if (!book) {
            throw new HttpError(404,`Book with id ${id} not found`);
        }
        if (book.status !== BookStatus.ON_HAND) {
            throw new HttpError(404, 'The book is in stock');
        }
        const result = [...book.pickList].reverse().find(item => item.return_date === null);
        if (!result) {
            throw new HttpError(400,'No active pick record found for this book');
        }
        result.return_date = new Date().toISOString();
        book.status = BookStatus.ON_STOCK;

    }

    async getBooksByGenreAndStatus(genre:BookGenres,status:BookStatus):Promise<Book[]> {
        const result = await BookMongooseModel.find({genre,status}).exec() as Book[];
        return Promise.resolve(result);

}

    getBooksById(id: string): Promise<Book> {
        const res = this.books.find(b => b.id === id);
        if(!res) throw new HttpError(404, `Book with id ${id} not found`);
        return Promise.resolve(res);
    }
}