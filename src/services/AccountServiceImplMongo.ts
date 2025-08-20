import {AccountService} from "./accountService.js";
import {Readers} from "../model/Readers.js";
import {ReaderModel} from "../model/ReaderMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";

export class AccountServiceImplMongo implements AccountService{

    async addAccount(reader: Readers): Promise<void> {
        const temp = await ReaderModel.findById(reader._id)
        if (temp) throw new HttpError(409, 'Reader already exists');
        const readerDoc = new ReaderModel(reader);
        await readerDoc.save()
    }

    async changePassword(id: number, newPassword: string): Promise<void> {
        const reader = await ReaderModel.findById(id);
        if(!reader) throw new HttpError(400, "Reader not found");
        reader.passHash = await bcrypt.hash(newPassword, 10);
        await reader.save();
    }

    async getAccount(id: number): Promise<Readers> {
        const result = await ReaderModel.findById(id);
        if (!result)
            throw new HttpError(404, `Reader with id: ${id} not found`);
        return {
            _id:result._id,
            userName:result.userName,
            email:result.email,
            birthdate:result.birthdate,
            passHash:result.passHash
        }
    }
    async getAllAccount():Promise<Readers[]>{
     const result = await ReaderModel.find().exec() as Readers[];
        return Promise.resolve(result);
    }

    async removeAccount(id: number): Promise<Readers> {
        const temp = await ReaderModel.findByIdAndDelete(id);
        if (!temp) throw new HttpError(404, `Reader with id: ${id} not found`);
        return {
            _id:temp._id,
            userName:temp.userName,
            email:temp.email,
            birthdate: temp.birthdate,
            passHash:temp.passHash
        }

    }


}

export const accountServiceMongo = new AccountServiceImplMongo();