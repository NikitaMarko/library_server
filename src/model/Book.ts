import * as mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type BookDto = {
    title: string,
    author: string,
    genre: string,
    quantity?: number,
    _id?: string;
}

export type Book = {
    id: string,
    title: string,
    author: string,
    genre: BookGenres,
    status: BookStatus,
    pickList:PickRecord[]
}

export enum BookGenres {
    "SCI_FI"= 'sci-fi',
    "ADVENTURE" = 'adventure',
    "FANTASY" = 'fantasy',
    "ROMANTIC" = 'romantic',
    "CLASSIC" = 'classic',
    "DYSTOPIA" = 'dystopia',
    "DETECTIVE" = 'detective'
}

export enum BookStatus {
    "ON_STOCK" = 'on stock',
    "ON_HAND" = 'on hand',
    "REMOVED" = 'removed',
}

export type PickRecord = {
    reader: string,
    pick_date: string,
    return_date: string | null
}

export const BookDtoMongooseSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    quantity: { type: Number, min:0, default:0 },
    status: {
        type: String,
        enum: Object.values(BookStatus),
        default: BookStatus.ON_STOCK,
        required: true
    },
    pickList: [
        {
            reader: { type: String, required: true },
            pick_date: { type: Date, required: true },
            return_date: { type: Date, default: null }
        }
    ]
})

export const BookDtoDBModel = mongoose.model('Book', BookDtoMongooseSchema, 'book_collection');