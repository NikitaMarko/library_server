import Joi from 'joi';

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
export const IdSchema = Joi.string().uuid({ version: 'uuidv4' });

export const BookDtoSchema = Joi.object({
    title: Joi.string().min(2).required(),
    author: Joi.string().min(1).required(),
    genre: Joi.string().required(),
    quantity: Joi.number().min(1).max(10)
})

