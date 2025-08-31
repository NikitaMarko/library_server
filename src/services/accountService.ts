import {LoginPass, Roles} from "../utils/libTypes.js";
import {Reader} from "../model/Reader.js";

export interface AccountService{
    addAccount: (reader: Reader) => Promise<void>;
    getAccountById: (id:number) => Promise<Reader>;
    removeAccount: (id:number) => Promise<Reader>;
    changePassword: (id: number, newPassword: string) => Promise<void>;
    changeEmailNameAndBirthdate:(id: number, newEmail: string, newUserName: string, newBirthdate: string) => Promise<Reader>;
    changeRoles: (id:number, newRoles:Roles[]) => Promise<Reader>;
    login: (credentials:LoginPass) => Promise<string>;
}