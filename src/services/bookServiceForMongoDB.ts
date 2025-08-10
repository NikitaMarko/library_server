import {BookDto, BookDtoDBModel} from "../model/Book.js";

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

export const pickUpBook = async (data: BookDto) => {}

export const returnBook = async (data: BookDto) => {}

export const removeBook = async (_id:string) => {
    return BookDtoDBModel.findByIdAndDelete(_id);
}