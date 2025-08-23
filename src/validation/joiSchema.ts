import Joi from "joi";
import {Roles} from "../utils/libTypes.js";

export const ReaderDtoSchema = Joi.object({
    id:Joi.number().positive().min(100000000).max(999999999).required(),
    userName:Joi.string().min(1).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).required(),
    birthdate:Joi.string().isoDate().required(),
    role: Joi.string().valid(...Object.values(Roles)).optional()
})

export const ReaderIdSchema = Joi.object({
    id: Joi.number().positive().min(100000000).max(999999999).required()
});

export const ChangePasswordDtoSchema = Joi.object({
    id:Joi.number().positive().min(100000000).max(999999999).required(),
    password:Joi.string().alphanum().min(8).required()
})
export const ChangeEmailNameBirthdateDtoSchema = Joi.object({
    id:Joi.number().positive().min(100000000).max(999999999).required(),
    userName:Joi.string().min(1).required(),
    email:Joi.string().email().required(),
    birthdate:Joi.string().isoDate().required()
})