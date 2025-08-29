import {AccountService} from "./accountService.js";
import {ReaderModel} from "../model/ReaderMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
import {Roles} from "../utils/libTypes.js";
import {Reader} from "../model/Reader.js";

export class AccountServiceImplMongo implements AccountService{

    async addAccount(reader: Reader): Promise<void> {
        const temp = await ReaderModel.findById(reader._id)
        if (temp) throw new HttpError(409, 'Reader already exists');
        const readerDoc = new ReaderModel(reader);
        await readerDoc.save()
    }

    async changePassword(id: number, newPassword: string): Promise<void> {
        const reader = await ReaderModel.findById(id).exec();
        if(!reader) throw new HttpError(400, "Reader not found");
        reader.passHash = await bcrypt.hash(newPassword, 10);
        await reader.save();
    }

    async getAccountById(id: number): Promise<Reader> {
        const result = await ReaderModel.findOne({ _id: id }).exec();
        if (!result)
            throw new HttpError(404, `Reader with id: ${id} not found`);
        return result as unknown as Reader;
    }
    async getAllAccount():Promise<Reader[]>{
     const result = await ReaderModel.find().exec() as unknown as Reader[];
        return Promise.resolve(result);
    }

    async removeAccount(id: number): Promise<Reader> {
        const temp = await ReaderModel.findByIdAndDelete(id).exec();
        if (!temp) throw new HttpError(404, `Reader with id: ${id} not found`);
        return temp as unknown as Reader;
    }

    async changeEmailNameAndBirthdate(id: number, newEmail: string, newUserName: string, newBirthdate: string): Promise<Reader> {
        const result = await ReaderModel.findByIdAndUpdate(id,{
            email: newEmail,
                userName: newUserName,
                birthdate: newBirthdate
        },
        { new: true });
        if(!result) throw new HttpError(400, "Reader not found");
        return result as unknown as Reader;
    }
    async updateAccount(updReader: Reader): Promise<Reader> {
        const result =
            await ReaderModel.findByIdAndUpdate(updReader._id, {userName: updReader.userName, email: updReader.email, birthdate: updReader.birthdate},{new:true})
        if(!result) throw new HttpError(404, "Account not found");
        return result as unknown as Reader;
    }

    async changeRoles(id: number, newRoles: Roles[]): Promise<Reader> {
        const result =
            await ReaderModel.findByIdAndUpdate(id, {roles : newRoles},{new:true})
        if(!result) throw new HttpError(404, "Account not found");
        return result as unknown as Reader;
    }

}

export const accountServiceMongo = new AccountServiceImplMongo();