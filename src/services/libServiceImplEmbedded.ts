import {LibService} from "./libService.ts";
import {Book, BookGenres} from "../model/Book.ts";

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
    }

}