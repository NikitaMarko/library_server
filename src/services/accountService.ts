import {Roles} from "../utils/libTypes.js";
import {Reader} from "../model/Reader.js";

export interface AccountService{
    addAccount: (reader: Reader) => Promise<void>;
    getAccountById: (id:number) => Promise<Reader>;
    removeAccount: (id:number) => Promise<Reader>;
    changePassword: (id: number, newPassword: string, oldPassword:string) => Promise<void>;
    updateAccount:(updReader: Reader) => Promise<Reader>;
    changeRoles: (id:number, newRoles:Roles[]) => Promise<Reader>;
}