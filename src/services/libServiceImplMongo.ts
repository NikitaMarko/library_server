import {LibService} from "./libService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {BookMongooseModel} from "../model/BookMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class LibServiceImplMongo implements LibService{
    async addBook(book: Book): Promise<boolean> {
        const isExist = await BookMongooseModel.findById(book.id).exec()
        if(isExist)
            return Promise.resolve(false);
        const newBook = new BookMongooseModel(book);
        await newBook.save();
        // const temp = await BookMongooseModel.create({
        //     // _id: book.id,
        //     title: book.title,
        //     author: book.author,
        //     genre: book.genre,
        //     status: book.status,
        //     pickList:book.pickList
        // })
        //if(!temp) return Promise.resolve(false);
        return Promise.resolve(true);
    }

    async getAllBooks(): Promise<Book[]> {
        const result = await BookMongooseModel.find().exec() as Book[];
        return Promise.resolve(result);
    }

    async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        const result = await BookMongooseModel.find({genre}).exec() as Book[];
        return Promise.resolve(result);
    }

    async pickUpBook(id: string, reader: string): Promise<void> {
        const book = await BookMongooseModel.findById(id).exec();
        if (!book)
            throw new HttpError(404, `Book with id: ${id} not found`);
            if(book.status !== BookStatus.ON_STOCK)
                throw new HttpError(409, "Book just on hand")
            book.status = BookStatus.ON_HAND;
            book.pickList.push({reader, pick_date:new Date().toString(), return_date:null});

         book.save();
    }

    async removeBook(id: string): Promise<Book | null> {
        const result = await BookMongooseModel.findByIdAndDelete(id).exec();
        if (!result) {
            return null
        }
        return {
            id: result._id.toString(),
            title: result.title,
            author: result.author,
            genre: result.genre,
            status: result.status,
            pickList: result.pickList.map(p => ({
                reader: p.reader,
                pick_date: p.pick_date,
                return_date: p.return_date,
            }))
        };
    }

    async returnBook(id: string): Promise<void> {
        const book = await BookMongooseModel.findById(id).exec();
        if (!book)
            throw new HttpError(404, `Book with id: ${id} not found`);
        if (book.status !== BookStatus.ON_HAND)
            throw new HttpError(409, "Book on stock")
        book.status = BookStatus.ON_STOCK;
        const temp = book.pickList[book.pickList.length - 1];
        temp.return_date = new Date().toString();
        book.save()
    }

    async getBooksByGenreAndStatus(genre:BookGenres,status:BookStatus):Promise<Book[]> {
        const result = await BookMongooseModel.find({genre,status}).exec() as Book[];
        return Promise.resolve(result);
    }

    async getBooksById(id: string): Promise<Book> {
        const result = await BookMongooseModel.findOne({id}).exec();
        if (!result)
            throw new HttpError(404, `Book with id: ${id} not found`);
        return {
            id:result.id,
            title:result.title,
            author:result.author,
            genre:result.genre,
            status:result.status,
            pickList:result.pickList
        }
    }
}


export const  libServiceImplMongo = new LibServiceImplMongo();