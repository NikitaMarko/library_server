import {Readers} from "../model/Readers.js";

export interface AccountService{
    addAccount: (reader:Readers) => Promise<void>;
    getAccount: (id:number) => Promise<Readers>;
    removeAccount: (id:number) => Promise<Readers>;
    changePassword: (id:number, newPassword:string) => Promise<void>;
    changeEmailNameAndBirthdate: (id:number, newEmail:string, newName:string, newBirthdate:string) => Promise<void>;
    getAllAccount: () => Promise<Readers[]>;
}