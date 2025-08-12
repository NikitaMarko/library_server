// import {BookDto, BookDtoDBModel, BookStatus} from "../model/Book.js";
// import {HttpError} from "../errorHandler/HttpError.js";
// import {getBookOrThrowError} from "../utils/tools.js";
//
// export const addBook = async (data: BookDto) => {
//     const bookToAdd = new BookDtoDBModel(data);
//     return await bookToAdd.save();
// }
//
// export const getAllBooks = async () => {
//     return BookDtoDBModel.find();
// }
//
// export const getBookByGenre = async (genre: string) => {
// const bookGenre = {genre};
// return BookDtoDBModel.find(bookGenre);
// }
//
// export const pickUpBook = async (id:string, reader:string) => {
//     const book = await getBookOrThrowError(id);
//
//     if(book.status !== BookStatus.ON_STOCK) {
//         throw new HttpError(400, 'The book is in the hands of readers');
//     }
//     book.status = BookStatus.ON_HAND;
//     const now = new Date().toISOString();
//
//     book.pickList.push({
//         reader,
//         pick_date:now,
//         return_date:null
//     });
//     return book.save();
//
// }
//
// export const returnBook = async (id:string) => {
//     const book = await getBookOrThrowError(id);
//
//     if (book.status !== BookStatus.ON_HAND) {
//         throw new HttpError(404, 'Book is not currently borrowed');
//     }
//     const result = [...book.pickList].reverse().find(item => item.return_date === null);
//     if (!result) {
//         throw new HttpError(400,'No active pick record found for this book');
//     }
//     result.return_date = new Date();
//     book.status = BookStatus.ON_STOCK;
//     await book.save();
//
// }
//
// export const removeBook = async (id:string) => {
//     return BookDtoDBModel.findByIdAndDelete(id);
// }