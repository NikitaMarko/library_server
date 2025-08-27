import {Roles} from "../utils/libTypes.js";

export type ReadersDto = {
    id:number,
    userName:string,
    email:string,
    password:string,
    birthdate:string,
    role?:Roles
}

export type Readers = {
    _id:number,
    userName:string,
    email:string,
    birthdate:string,
    passHash:string
    role:Roles[]
}