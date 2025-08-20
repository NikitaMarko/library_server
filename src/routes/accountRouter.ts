import express from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../validation/bodyValidation.js";
import {ChangePasswordDtoSchema, ReaderDtoSchema} from "../validation/joiSchema.js";

export const accountRouter = express.Router();


accountRouter.post('/', bodyValidation(ReaderDtoSchema),controller.addAccount);
accountRouter.get('/reader/:id', controller.getAccount);
accountRouter.patch('/password', bodyValidation(ChangePasswordDtoSchema), controller.changePassword)
accountRouter.delete('/:id', controller.removeAccount)
accountRouter.get('/', controller.getAllAccount)