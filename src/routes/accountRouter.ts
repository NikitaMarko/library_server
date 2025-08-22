import express from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../validation/bodyValidation.js";
import {ChangePasswordDtoSchema, ReaderDtoSchema} from "../validation/joiSchema.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {Response} from 'express'

export const accountRouter = express.Router();


accountRouter.post('/', bodyValidation(ReaderDtoSchema),controller.addAccount);
accountRouter.get('/reader/:id', async (req: AuthRequest, res:Response) => {
    if(req.roles?.includes(Roles.USER))
        await controller.getAccount(req, res);
    throw new HttpError(403, "")
});
accountRouter.patch('/password', bodyValidation(ChangePasswordDtoSchema), controller.changePassword)
accountRouter.delete('/:id', controller.removeAccount)
accountRouter.get('/', controller.getAllAccount)