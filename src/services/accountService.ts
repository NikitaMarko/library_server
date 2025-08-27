import {Readers} from "../model/Readers.js";
import {Roles} from "../utils/libTypes.js";

export interface AccountService{
    addAccount: (reader: Readers) => Promise<void>;
    getAccountById: (id:number) => Promise<Readers>;
    removeAccount: (id:number) => Promise<Readers>;
    changePassword: (id: number, newPassword: string, oldPassword:string) => Promise<void>;
    changeEmailNameAndBirthdate:(id: number, newEmail: string, newUserName: string, newBirthdate: string) => Promise<Readers>;
    changeRoles: (id:number, newRoles:Roles[]) => Promise<Readers>;
    getAllAccount: () => Promise<Readers[]>;
}