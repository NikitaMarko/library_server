import express from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../validation/bodyValidation.js";
import {ChangeEmailNameBirthdateDtoSchema, ChangePasswordDtoSchema, ReaderDtoSchema} from "../validation/joiSchema.js";
import {AuthRequest} from "../utils/libTypes.js";
import {Response} from 'express'
import {access} from "../config/libConfig.js";
import {authorize} from "../middleware/authorization.js";

export const accountRouter = express.Router();
accountRouter.use(authorize(access));


accountRouter.post('/',
    bodyValidation(ReaderDtoSchema),
    async (req: AuthRequest, res: Response) => {
    await controller.addAccount(req,res)
    });
accountRouter.get('/reader/:id',
    async (req: AuthRequest, res:Response) => {
    await controller.getAccount(req, res);
    });
accountRouter.patch('/password',
    bodyValidation(ChangePasswordDtoSchema),
    async (req: AuthRequest, res:Response) => {
    await controller.changePassword(req, res)
    })
accountRouter.patch('/email-name-birthdate',
    bodyValidation(ChangeEmailNameBirthdateDtoSchema),
    async (req: AuthRequest, res: Response) => {
    await controller.changeEmailNameAndBirthdate(req,res)
    })
accountRouter.delete('/:id',
    async (req: AuthRequest, res:Response) => {
    await controller.removeAccount(req, res);
    })
accountRouter.get('/',
    async (req: AuthRequest, res:Response) => {
    await controller.getAllAccount(req,res)
    })