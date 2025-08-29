import {LibService} from "./libService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {configuration} from "../config/libConfig.js";



export class libServiceImplSQL implements LibService{


    async addBook(book: Book): Promise<boolean> {
        const result = await configuration.pool.query("INSERT INTO books VALUES (?,?,?,?,?)",
            [book.id, book.title, book.author, book.genre, book.status]);
        if(!result)
        return Promise.resolve(false);
        return Promise.resolve(true);
    }

    async removeBook(id: string): Promise<Book | null> {
        const book = await this.getBooksById(id)
        const record = 'DELETE FROM books WHERE id = ?';
        const [rows] = await configuration.pool.execute<ResultSetHeader>(record,[id]);
        if(rows.affectedRows === 0)
            throw new HttpError(404,`Could not remove book with id ${id}`);
        return book;
    }

    async getAllBooks(): Promise<Book[]> {
        const record = 'SELECT id, title, author, genre, status FROM books';
        const [rows] = await configuration.pool
            .query(record);
        const book = rows as Book[];
        if(book.length === 0)
            return [];
        return book;
    }

    async getBooksById(id: string): Promise<Book> {
        const record = 'SELECT * FROM books WHERE id = ?';
        const [rows] = await configuration.pool.execute<RowDataPacket[]>(record, [id]);
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
        const [rows] = await configuration.pool.execute<RowDataPacket[]>(record,[genre]);
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
        const [rows] = await configuration.pool.execute<RowDataPacket[]>(record, [genre, status]);
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
        const [rows] = await configuration.pool.execute<RowDataPacket[]>(record_book, [bookId]);
        if (rows.length === 0)
            throw new HttpError(404, `Book with ${bookId} not found`);
        const book = rows[0];
        if(book.status !== BookStatus.ON_STOCK)
            throw new HttpError(400, `Book with ID ${bookId} is not available.`);

        const record_reader = 'SELECT * FROM readers WHERE id = ?';
        const [readers] = await configuration.pool.execute<RowDataPacket[]>(record_reader, [readerId]);
        if (readers.length === 0)
            throw new HttpError(404, `Reader with ID ${readerId} not found`);

        await configuration.pool.execute(
            'INSERT INTO books_readers (book_id, reader_id, pick_date) VALUES (?, ?, CURDATE())',
            [bookId, readerId]
        );

        await configuration.pool.execute(
            'UPDATE books SET status = ? WHERE id = ?',
            [BookStatus.ON_HAND, bookId]
        )

    }


    async returnBook(bookId: string): Promise<void> {
        const record = 'SELECT * FROM books WHERE id = ?';
        const [rows] = await configuration.pool.execute<RowDataPacket[]>(record,[bookId]);
        if (rows.length === 0)
            throw new HttpError(404, `Book with ID ${bookId} not found`);
        const book = rows[0];
        if(book.status !== BookStatus.ON_HAND)
            throw new HttpError(400, `Book with ID ${bookId} is not currently on hand`);

        await configuration.pool.execute(
            `UPDATE books_readers 
        SET return_date = CURDATE()
        WHERE book_id = ? AND return_date IS NULL
        ORDER BY pick_date DESC
        LIMIT 1`,
            [bookId]
        );

        await configuration.pool.execute(
            'UPDATE books SET status = ? WHERE id = ?',
            [BookStatus.ON_STOCK, bookId]
        )
    }
    /*
    async addBook(book: Book): Promise<boolean> {
        const result = await pool.query('INSERT INTO books VALUES(?,?,?,?,?)',
            [book.id, book.title, book.author, book.genre, book.status])
       // console.log(result)
        if(!result)
        return Promise.resolve(false);
        else return Promise.resolve(true);
    }

    async getAllBooks(): Promise<Book[]> {
        const [result] = await pool.query('SELECT * FROM books')
        return result as unknown as Book[];
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const [result] = await pool.query('SELECT * from books WHERE genre = ?', [genre])
        return result as Book[];
    }

    async pickUpBook(id: string, reader: string): Promise<void> {
        const book = await this.getBookById(id);
        if (book.status !== BookStatus.ON_STOCK)
            throw new HttpError(400, "Wrong book status")

        let queriedReader = await this.getReaderByName(reader);
        if (!book)
            throw new HttpError(400,"Can't return book because this book or reader not exists");
        if (!queriedReader) {
            await pool.query('INSERT INTO readers VALUES (null, ?)', [reader]);
            queriedReader = await this.getReaderByName(reader);
        }

        await pool.query('INSERT INTO books_readers VALUES(?, ?, ?, ?)',
            [book.id, queriedReader.reader_id, new Date().toDateString(), null]);
        pool.query('UPDATE books SET status = "on_hand" WHERE id = ?', [id])

    }

    private getReaderByName = async (reader: string) => {
        const query = 'SELECT * FROM readers WHERE name = ?'
        const [result] = await pool.query(query, [reader]);
        const readersArr = result as { reader_id: number, name: string }[];
        const [queriedReader] = readersArr;
        return queriedReader;
    }

    async removeBook(id: string): Promise<Book> {
        const book = await this.getBookById(id);
        if (book.status !== BookStatus.ON_STOCK)
            throw new HttpError(400, "Wrong book status. Book on hand yet");
        book.status = BookStatus.REMOVED;
        pool.query('DELETE FROM books_readers WHERE book_id = ?', [id])
        pool.query('DELETE FROM books WHERE id = ?', [id])
        return book;
    }

    async returnBook(id: string): Promise<void> {
        const book = await this.getBookById(id);
        if (book.status !== BookStatus.ON_HAND)
            throw new HttpError(400,"Wrong book status");
        pool.query('UPDATE books SET status = "on_stock" WHERE id = ?', [id])
        await pool.query('UPDATE books_readers SET return_date = ? WHERE book_id = ? AND return_date IS NULL', [new Date().toDateString(), id]);
    }

    async getBookById(id: string): Promise<Book> {
        const query = 'SELECT * FROM books WHERE id = ?';
        const value = [id]
        const [result] = await pool.query(query, value);
        const books = result as Book[];

        if (books.length) {
            let queryedBook = books[0];
            const pickRecords = await this.getPickRecordsByBookId(queryedBook.id)
            queryedBook.pickList = pickRecords;
            return Promise.resolve(queryedBook)
        }
        throw new HttpError(404,`Book with id ${id} not found`);
    }

    getBooksByGenreAndStatus(genre: BookGenres, status: BookStatus): Promise<Book[]> {
        return Promise.resolve([]);
    }

    getPickRecordsByBookId = async (id: string) => {
        const query = 'SELECT pick_date, return_date, name as reader FROM (books_readers as b_r JOIN readers as r ON b_r.reader_id = r.reader_id) WHERE b_r.book_id = ?'
        const [result] = await pool.query(query, [id])
        return result as {pick_date: string, return_date:string, reader: string}[];
    }

     */
}


export const libServiceSql = new libServiceImplSQL();