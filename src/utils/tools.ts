import {Book, BookDto, BookGenres, BookStatus} from "../model/Book.ts";
import { v4 as uuidv4 } from 'uuid';
import {HttpError} from "../errorHandler/HttpError.js";
import {BookMongooseModel} from "../model/BookMongooseModel.js";
import bcrypt from "bcryptjs";
import {Roles} from "./libTypes.js";
import jwt from "jsonwebtoken";
import {configuration} from "../config/libConfig.js";
import {Reader, ReaderDto} from "../model/Reader.js";
import {BookSchemas} from "../validation/joiSchema.js";

export function getGenres(genre: string) {
    const bookGenre = Object.values(BookGenres).find(value => value===genre);
    if (!bookGenre) throw new HttpError(400, 'Wrong genre');
    else return bookGenre;
}
export function getStatus(status: string) {
    const bookStatus = Object.values(BookStatus).find(v => v === status);

    if(!bookStatus) throw  new HttpError(400, "Wrong status")
    else return bookStatus;
}

export const convertBookDtoToBook = (dto:BookDto) =>{
    return {
        id: uuidv4(),
        title: dto.title,
        author: dto.author,
        genre: getGenres(dto.genre),
        status: BookStatus.ON_STOCK,
        pickList:[]
    }
}
export const convertReaderDtoToReader = (dto:ReaderDto):Reader => {
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(dto.password, salt);
return {
    _id:dto.id,
    userName:dto.userName,
    email:dto.email,
    birthdate:dto.birthdate,
    passHash:hash,
    roles: [Roles.USER]
}
}

export function bookObjectValidate(
    book: Book | undefined,
) {
    if (!book) {
        throw new HttpError (400, "Body is required");
    }
    const {error} = BookSchemas.validate(book);
    if (error) {
        throw new HttpError (400, error.message);
    }
}
export const getBookOrThrowError = async (id: string) => {
    const book = await BookMongooseModel.findById(id);
    if (!book) {
        throw new HttpError(404, `Book with id ${id} not found`);
    }
    return book;
};
export const checkReaderId = (id: string | undefined) => {
    if (!id) throw new HttpError(400, "No ID in request");
    const _id = parseInt(id as string);
    if (!_id) throw new HttpError(400, "ID must be a number");
    return _id;
}

export const getJWT = (userId:number, roles:Roles[]) =>{
    const payload = {
        roles:JSON.stringify(roles)
    };
    const secret = configuration.jwt.secret;

    const options = {
        expiresIn:configuration.jwt.exp as any,
        subject:userId.toString()
    }

    return jwt.sign(payload,secret, options);
}