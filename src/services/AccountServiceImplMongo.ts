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
        const reader = await ReaderModel.findById(id).exec();
        if(!reader) throw new HttpError(400, "Reader not found");
        reader.passHash = await bcrypt.hash(newPassword, 10);
        await reader.save();
    }

    async getAccount(id: number): Promise<Readers> {
        const result = await ReaderModel.findById(id).exec();
        if (!result)
            throw new HttpError(404, `Reader with id: ${id} not found`);
        return result
    }
    async getAllAccount():Promise<Readers[]>{
     const result = await ReaderModel.find().exec() as Readers[];
        return Promise.resolve(result);
    }

    async removeAccount(id: number): Promise<Readers> {
        const temp = await ReaderModel.findByIdAndDelete(id).exec();
        if (!temp) throw new HttpError(404, `Reader with id: ${id} not found`);
        return temp
    }

    async changeEmailNameAndBirthdate(id: number, newEmail: string, newUserName: string, newBirthdate: string): Promise<void> {
        const result = await ReaderModel.findById(id);
        if(!result) throw new HttpError(400, "Reader not found");
        result.userName = newUserName;
        result.birthdate = newBirthdate;
        result.email = newEmail;
        await result.save()
    }




    /* version from Konstantin
    import {AccountService} from "./accountService.js";
import {Reader} from "../model/Reader.js";
import {ReaderModel} from "../model/ReaderMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";


export class AccountServiceImplMongo implements AccountService{

    async addAccount(reader: Reader): Promise<void> {
        const temp = await ReaderModel.findById(reader._id);
        if(temp) throw new HttpError(409, "Reader already exists");
        const readerDoc = new ReaderModel(reader);
        await readerDoc.save();
    }

    async changePassword(id: number, oldPassword: string, newPassword:string): Promise<void> {
        console.log(id, oldPassword, newPassword)
        const account = await ReaderModel.findById(id);
        console.log(account)
        if (!account) throw new HttpError(404, "Account not found");
        const checkPass = bcrypt.compareSync(oldPassword, account.passHash);
        console.log(checkPass)
        if(!checkPass) throw new HttpError(403, "");
        else{
            const newHash = bcrypt.hashSync(newPassword, 10);
            account.passHash = newHash;
            await account.save();
        }
    }

    async getAccountById(id: number): Promise<Reader> {
        const result = await ReaderModel.findById(id);
        if(!result) throw new HttpError(404, "Account not found");
        return result as unknown as Reader;
    }

    async removeAccount(id: number): Promise<Reader> {
        const result = await ReaderModel.findByIdAndDelete(id);
        if(!result) throw new HttpError(404, "Account not found");
        return result as unknown as Reader;
    }

}

export const accountServiceMongo = new AccountServiceImplMongo();
     */


}

export const accountServiceMongo = new AccountServiceImplMongo();