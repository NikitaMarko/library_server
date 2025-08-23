import express, {NextFunction} from "express";
import * as controller from '../controllers/accountController.js'
import {bodyValidation} from "../validation/bodyValidation.js";
import {ChangeEmailNameBirthdateDtoSchema, ChangePasswordDtoSchema, ReaderDtoSchema} from "../validation/joiSchema.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {Response} from 'express'
import {access} from "../config/libConfig.js";
import {authorize} from "../middleware/authorization.js";

export const accountRouter = express.Router();


accountRouter.post('/',
    authorize(access),
    bodyValidation(ReaderDtoSchema),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        await controller.addAccount(req,res)
    }catch(err){
        next(err)
    }
    });
accountRouter.get('/reader/:id',
    authorize(access),
    async (req: AuthRequest, res:Response,next:NextFunction) => {
    // if(req.roles?.includes(Roles.USER))
    try{
        await controller.getAccount(req, res);
    }
    catch(err){
        next(err);
    }
});
accountRouter.patch('/password',
    authorize(access),
    bodyValidation(ChangePasswordDtoSchema),
    async (req: AuthRequest, res:Response,next:NextFunction) => {
        // if(req.roles?.includes(Roles.USER))
        try{
            await controller.changePassword(req, res)
        }catch(err){
            next(err);
        }
    })
accountRouter.patch('/email-name-birthdate',
    authorize(access),
    bodyValidation(ChangeEmailNameBirthdateDtoSchema),
    async (req: AuthRequest, res: Response,next:NextFunction) => {
    try {
        await controller.changeEmailNameAndBirthdate(req,res)
    }catch(err){
        next(err);
    }
    })
accountRouter.delete('/:id',
    authorize(access),
    async (req: AuthRequest, res:Response,next:NextFunction) => {
    try {
        await controller.removeAccount(req, res);
    }catch(err){
        next(err);
    }
    })
accountRouter.get('/',
    authorize(access),
    async (req: AuthRequest, res:Response,next:NextFunction) => {
    try{
    await controller.getAllAccount(req,res)}
    catch(err){
        next(err);
    }})