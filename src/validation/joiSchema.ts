import Joi from "joi";

export const ReaderDtoSchema = Joi.object({
    id:Joi.number().positive().max(999999999).min(100000000).required(),
    userName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
    birthdate: Joi.string().isoDate().required()
})

export const ChangePassDtoSchema = Joi.object({
    id:Joi.number().positive().max(999999999).min(100000000).required(),
    newPassword: Joi.string().alphanum().min(8).required(),
});
export const ChangeEmailNameBirthdateDtoSchema = Joi.object({
    id:Joi.number().positive().max(999999999).min(100000000).required(),
    newUserName: Joi.string().min(1).required(),
    newEmail: Joi.string().email().required(),
    newBirthdate: Joi.string().isoDate().required()
})
export const LoginSchema = Joi.object({
    userId:Joi.number().positive().max(999999999).min(100000000).required(),
    password: Joi.string().alphanum().min(8).required()

})

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
        .valid('sci-fi', 'adventure', 'romantic', 'fantasy','classic', 'dystopia', 'detective')
        .lowercase()
        .required()
});
export const IdSchema = Joi.object({
    id: Joi.string().uuid({ version: 'uuidv4' }).required()
});
export const BookDtoSchema = Joi.object({
    title: Joi.string().min(2).required(),
    author: Joi.string().min(1).required(),
    genre: Joi.string().required(),
    quantity: Joi.number().min(1).max(10)
})

export const ChangeRolesSchema = Joi.object({
    id: Joi.number().required(),
    newRoles: Joi.array()
        .items(Joi.string().valid("user", "admin", "librarian", "super"))
        .required()
});


// export const ChangeRolesSchema = Joi.array<Roles[]>()

// export type ArraySchema = typeof ChangeRolesSchema;