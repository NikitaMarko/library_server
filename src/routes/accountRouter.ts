import express from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../validation/bodyValidation.js";
import {ChangeEmailNameBirthdateDtoSchema, ChangePasswordDtoSchema, ReaderDtoSchema} from "../validation/joiSchema.js";
import {AuthRequest} from "../utils/libTypes.js";
import {Response} from 'express'
import {access} from "../config/libConfig.js";
import {authorize} from "../middleware/authorization.js";

export const accountRouter = express.Router();


accountRouter.post('/',
    authorize(access),
    bodyValidation(ReaderDtoSchema),
    async (req: AuthRequest, res: Response) => {
    await controller.addAccount(req,res)
    });

accountRouter.get('/reader/:id',
    authorize(access),
    async (req: AuthRequest, res:Response) => {
    await controller.getAccount(req, res);
    });

accountRouter.patch('/password',
    authorize(access),
    bodyValidation(ChangePasswordDtoSchema),
    async (req: AuthRequest, res:Response) => {
    await controller.changePassword(req, res)
    })

accountRouter.patch('/email-name-birthdate',
    authorize(access),
    bodyValidation(ChangeEmailNameBirthdateDtoSchema),
    async (req: AuthRequest, res: Response) => {
    await controller.changeEmailNameAndBirthdate(req,res)
    })

accountRouter.delete('/:id',
    authorize(access),
    async (req: AuthRequest, res:Response) => {
    await controller.removeAccount(req, res);
    })

accountRouter.get('/',
    authorize(access),
    async (req: AuthRequest, res:Response) => {
    await controller.getAllAccount(req,res)
    })