import {Request,Response} from 'express'
import {Readers, ReadersDto} from "../model/Readers.js";
import {convertReaderDtoToReader} from "../utils/tools.js";
import {accountServiceMongo} from "../services/AccountServiceImplMongo.js";

export const addAccount = async (req: Request, res: Response) => {
    const body = req.body;
    const reader: Readers = convertReaderDtoToReader(body as ReadersDto);
    await accountServiceMongo.addAccount(reader)
    res.status(201).send();
}
export const getAccount = (req:Request,res:Response)=>{
    res.send('ok')
}
export const changePassword = (req:Request,res:Response)=>{
    res.send('ok')
}
export const removeAccount = (req:Request,res:Response)=>{
    res.send('ok')
}