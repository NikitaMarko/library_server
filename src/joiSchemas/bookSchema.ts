import Joi from 'joi';
import {v4 as uuidv4} from "uuid";

export const BookSchemas = Joi.object({
    id: Joi.string().required(),
    title: Joi.string(),
    author: Joi.string(),
    genre: Joi.string(),
    status: Joi.string(),
    pickList:Joi.array(),
})
export const GenreSchema = Joi.object({
    genre: Joi.string()
        .valid('sci-fi', 'adventure', 'romantic', 'classic', 'dystopia', 'detective')
        .lowercase()
        .required()
});