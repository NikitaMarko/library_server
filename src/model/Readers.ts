
export type ReadersDto = {
    id:number,
    userName:string,
    email:string,
    password:string,
    birthdate:string,
}

export type Readers = {
    _id:number,
    userName:string,
    email:string,
    birthdate:string,
    passHash:string
    role:string
}