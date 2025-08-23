import mongoose from "mongoose";
import {Roles} from "../utils/libTypes.js";

const readerMongoSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    birthdate: { type: String, required: true },
    passHash: { type: String, required: true },
    role: {type: String, enum: Object.values(Roles), default: Roles.USER}
})

export const ReaderModel = mongoose
.model('Reader', readerMongoSchema, 'reader_collection')