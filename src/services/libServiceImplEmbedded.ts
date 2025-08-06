import {LibService} from "./libService.ts";
import {Book, BookGenres, BookStatus} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.js";

export class LibServiceImplEmbedded implements LibService{
    private books: Book[] = [];

    addBook(book: Book): boolean {
    const index = this.books.findIndex(item => item.id === book.id);
    if(index === -1) {
        this.books.push(book);
    return true;
    }
        return false;
    }

    getAllBooks(): Book[] {
        return [...this.books];
    }

    getBooksByGenre(genre: BookGenres): Book[] {
        const genres = this.books.filter(item => item.genre.toLowerCase() === genre.toLowerCase());
        return genres as Book[];
    }

    pickUpBook(id: string, reader: string): void {
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

    removeBook(id: string): Book|null {
    const indexBook = this.books.findIndex(item => item.id === id);
    if(indexBook !== -1) {
        const [deletedBook] = this.books.splice(indexBook, 1);
        return deletedBook;
    }
    return null;
    }

    returnBook(id: string): void {
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

}