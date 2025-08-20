import {Request,Response} from 'express'
import {Readers, ReadersDto} from "../model/Readers.js";
import {convertReaderDtoToReader} from "../utils/tools.js";
import {accountServiceMongo} from "../services/AccountServiceImplMongo.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {ReaderIdSchema} from "../validation/joiSchema.js";


export const addAccount = async (req: Request, res: Response) => {
    const body = req.body;
    const reader: Readers = convertReaderDtoToReader(body as ReadersDto);
    await accountServiceMongo.addAccount(reader)
    res.status(201).send();
}
export const getAccount = async (req: Request, res: Response) => {
    const {error, value} = ReaderIdSchema.validate(req.params);
    if (error) throw new HttpError(400, error.message);
    const {id} = value;
    const result = await accountServiceMongo.getAccount(id);
    const { passHash, ...safeUser } = result;
    res.status(200).json(safeUser)
}
export const getAllAccount = async (req: Request, res: Response) => {
    const result = await accountServiceMongo.getAllAccount();
    res.json(result);
}
export const changePassword = async (req: Request, res: Response) => {
    const {id, password} = req.body;
    if (!id || !password) {
        throw new HttpError(400, "Not id or newPassword");
    }
    await accountServiceMongo.changePassword(Number(id), password as string);
    res.status(204).send();
}
export const removeAccount = async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!id || isNaN(Number(id))) {
        throw new HttpError(400, 'Invalid or missing ID');
    }
    const result = await accountServiceMongo.removeAccount(Number(id))
    const { passHash, ...safeUser } = result
        res.json(safeUser)
}