import express from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../validation/bodyValidation.js";
import {
    ChangeEmailNameBirthdateDtoSchema,
    ChangePassDtoSchema, ChangeRolesSchema,
    ReaderDtoSchema
} from "../validation/joiSchema.js";


export const accountRouter = express.Router();


accountRouter.post('/',bodyValidation(ReaderDtoSchema),controller.addAccount);

accountRouter.get('/reader/:id',controller.getAccountById);

accountRouter.patch('/password',bodyValidation(ChangePassDtoSchema),controller.changePassword)

accountRouter.patch('/email-name-birthdate',bodyValidation(ChangeEmailNameBirthdateDtoSchema),
    controller.changeEmailNameAndBirthdate)

accountRouter.delete('/:id',controller.removeAccount)

accountRouter.get('/',controller.getAllAccount);

accountRouter.get('/reader/:id',controller.getAccountById);

accountRouter.put('/roles',bodyValidation(ChangeRolesSchema),controller.changeRoles)