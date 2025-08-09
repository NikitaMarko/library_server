import {BookDto, BookDtoDBModel} from "../model/Book.js";

export const addBook = async (data: BookDto) => {
    const bookToAdd = new BookDtoDBModel(data);
    return await bookToAdd.save();
}

export const getAllBooks = async () => {
    return BookDtoDBModel.find();
}