import mongoose from "mongoose";

const readerMongoSchema = new mongoose.Schema({

})

export const ReaderModel = mongoose
.model('Reader', readerMongoSchema, 'reader_collection')