import mongoose from "mongoose";

const readerMongoSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    birthdate: { type: String, required: true },
    passHash: { type: String, required: true }
})

export const ReaderModel = mongoose
.model('Reader', readerMongoSchema, 'reader_collection')