import {LibService} from "./libService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {pool} from "../config/libConfig.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";


export class libServiceImplSQL implements LibService{

    async addBook(book: Book): Promise<boolean> {
        const result = await pool.query("INSERT INTO books VALUES (?,?,?,?,?)",
            [book.id, book.title, book.author, book.genre, book.status]);
        if(!result)
        return Promise.resolve(false);
        return Promise.resolve(true);
    }

    async removeBook(id: string): Promise<Book | null> {
        const book = await this.getBooksById(id)
        const record = 'DELETE FROM books WHERE id = ?';
        const [rows] = await pool.execute<ResultSetHeader>(record,[id]);
        if(rows.affectedRows === 0)
            throw new HttpError(404,`Could not remove book with id ${id}`);
        return book;
    }

    async getAllBooks(): Promise<Book[]> {
        const record = 'SELECT id, title, author, genre, status FROM books';
        const [rows] = await pool
            .query(record);
        const book = rows as Book[];
        if(book.length === 0)
            return [];
        return book;
    }

    async getBooksById(id: string): Promise<Book> {
        const record = 'SELECT * FROM books WHERE id = ?';
        const [rows] = await pool.execute<RowDataPacket[]>(record, [id]);
        if (rows.length === 0)
            throw new HttpError(404, `Book with id ${id} not found`);
        return  {
            id: rows[0].id,
            title: rows[0].title,
            author: rows[0].author,
            genre: rows[0].genre as BookGenres,
            status: rows[0].status as BookStatus,
            pickList:[]
        }


    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const record = 'SELECT * FROM books WHERE genre = ?';
        const [rows] = await pool.execute<RowDataPacket[]>(record,[genre]);
        if (rows.length === 0)
            throw new HttpError(404, `Book with ${genre} not found`);
        return rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            genre: row.genre as BookGenres,
            status: row.status as BookStatus,
            pickList: []
        }));
    }

    async getBooksByGenreAndStatus(genre: BookGenres, status: BookStatus): Promise<Book[]> {
        const record = 'SELECT * FROM books WHERE genre = ? AND status = ?';
        const [rows] = await pool.execute<RowDataPacket[]>(record, [genre, status]);
        if (rows.length === 0)
            throw new HttpError(404, `Book with ${genre} and ${status} not found`);
        return rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            genre: row.genre as BookGenres,
            status: row.status as BookStatus,
            pickList: []
        }));
    }

    async pickUpBook(bookId: string, readerId: string): Promise<void> {
        const record_book = 'SELECT * FROM books WHERE id = ?';
        const [rows] = await pool.execute<RowDataPacket[]>(record_book, [bookId]);
        if (rows.length === 0)
            throw new HttpError(404, `Book with ${bookId} not found`);
        const book = rows[0];
        if(book.status !== BookStatus.ON_STOCK)
            throw new HttpError(400, `Book with ID ${bookId} is not available.`);

        const record_reader = 'SELECT * FROM readers WHERE id = ?';
        const [readers] = await pool.execute<RowDataPacket[]>(record_reader, [readerId]);
        if (readers.length === 0)
            throw new HttpError(404, `Reader with ID ${readerId} not found`);

        await pool.execute(
            'INSERT INTO books_readers (book_id, reader_id, pick_date) VALUES (?, ?, CURDATE())',
            [bookId, readerId]
        );

        await pool.execute(
            'UPDATE books SET status = ? WHERE id = ?',
            [BookStatus.ON_HAND, bookId]
        )

    }


    async returnBook(bookId: string): Promise<void> {
        const record = 'SELECT * FROM books WHERE id = ?';
        const [rows] = await pool.execute<RowDataPacket[]>(record,[bookId]);
        if (rows.length === 0)
            throw new HttpError(404, `Book with ID ${bookId} not found`);
        const book = rows[0];
        if(book.status !== BookStatus.ON_HAND)
            throw new HttpError(400, `Book with ID ${bookId} is not currently on hand`);
        await pool.execute(
            `UPDATE books_readers 
        SET return_date = CURDATE()
        WHERE book_id = ? AND return_date IS NULL
        ORDER BY pick_date DESC
        LIMIT 1`,
            [bookId]
        );

        await pool.execute(
            'UPDATE books SET status = ? WHERE id = ?',
            [BookStatus.ON_STOCK, bookId]
        )
    }
}


export const libServiceSql = new libServiceImplSQL();