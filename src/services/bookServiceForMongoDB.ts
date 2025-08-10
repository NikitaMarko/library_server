import {BookDto, BookDtoDBModel, BookStatus} from "../model/Book.js";
import {HttpError} from "../errorHandler/HttpError.js";

export const addBook = async (data: BookDto) => {
    const bookToAdd = new BookDtoDBModel(data);
    return await bookToAdd.save();
}

export const getAllBooks = async () => {
    return BookDtoDBModel.find();
}

export const getBookByGenre = async (genre: string) => {
const bookGenre = {genre};
return BookDtoDBModel.find(bookGenre);
}

export const pickUpBook = async (id:string, reader:string) => {
    const book = await BookDtoDBModel.findOne({ _id: id });
    if (!book) {
        throw new HttpError(404, `Book with id ${id} not found`);
    }
    if(book.status !== BookStatus.ON_STOCK) {
        throw new HttpError(400, 'The book is in the hands of readers');
    }
    book.status = BookStatus.ON_HAND;
    const now = new Date().toISOString();

    book.pickList.push({
        reader,
        pick_date:now,
        return_date:null
    });
    return book.save();

}

export const returnBook = async (data: BookDto) => {}

export const removeBook = async (_id:string) => {
    return BookDtoDBModel.findByIdAndDelete(_id);
}