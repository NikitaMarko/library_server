import {AccountService} from "./accountService.js";
import {Readers} from "../model/Readers.js";
import {ReaderModel} from "../model/ReaderMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class AccountServiceImplMongo implements AccountService{
    async addAccount(reader: Readers): Promise<void> {
        const temp = await ReaderModel.findById(reader._id)
        if (temp) throw new HttpError(409, 'Reader already exists');
        const readerDoc = new ReaderModel(reader);
        await readerDoc.save()
    }

    changePassword(id: number, newPassword: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAccount(id: number): Promise<Readers> {
        throw 'Not realised method';
    }

    removeAccount(id: number): Promise<Readers> {
        throw 'Not realised method';
    }

}

export const accountServiceMongo = new AccountServiceImplMongo();