import {Request, Response,NextFunction} from 'express'
import {checkReaderId, convertReaderDtoToReader} from "../utils/tools.js";
import {accountServiceMongo} from "../services/AccountServiceImplMongo.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {Reader, ReaderDto} from "../model/Reader.js";



export const addAccount = async (req: AuthRequest, res: Response) => {
    const body = req.body;
    if(!req.roles?.includes(Roles.ADMIN)) {
        delete body.role
    }
    const reader: Reader = convertReaderDtoToReader(body as ReaderDto);
    await accountServiceMongo.addAccount(reader)
    res.status(201).send();
}
export const getAccountById = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const id = req.params.id;
        const _id = checkReaderId(id);
        const result = await accountServiceMongo.getAccountById(_id);
        const { passHash, ...safeUser } = result;
        res.status(200).json(safeUser);
    }   catch (error) {
        console.error("Controller error:", error);
        next(error);
    }
};

export const getAllAccount = async (req: Request, res: Response) => {
    const result = await accountServiceMongo.getAllAccount();
    res.json(result);
}
export const changePassword = async (req: Request, res: Response) => {
    const {id, newPassword} = req.body;
    await accountServiceMongo.changePassword(Number(id), newPassword as string);
    res.status(204).send();
}
export const removeAccount = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await accountServiceMongo.removeAccount(Number(id))
    const { passHash, ...safeUser } = result
        res.json(safeUser)
}
export const changeEmailNameAndBirthdate = async (req: Request, res: Response) => {
    const {id, newEmail, newBirthdate, newUserName} = req.body;
    await accountServiceMongo.changeEmailNameAndBirthdate(id, newEmail, newUserName, newBirthdate);
    res.status(200).send('Data updated successfully');
}
export const changeRoles = async (req: Request, res: Response) => {
    const id = checkReaderId(req.body.id as string);
    const newRoles = req.body.newRoles as Roles[];
    const readerWithNewRoles = await accountServiceMongo.changeRoles(id, newRoles);
    res.json(readerWithNewRoles)
}

