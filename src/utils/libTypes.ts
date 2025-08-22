import e from "express";

export interface AuthRequest extends e.Request{
    userId?: number,
    userName?: string,
    roles?: Roles[];
}

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
    GUEST = 'guest'
}