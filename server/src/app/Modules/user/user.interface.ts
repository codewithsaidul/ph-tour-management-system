import { Types } from "mongoose";

export enum ROLE {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}


export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAUTHPROVIDER {
    provider: "google" | "credentials";
    providerId: string
}

export interface IUSER {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: boolean;
    isVerified?: boolean;
    isActive?: IsActive;
    auths: IAUTHPROVIDER[];
    role: ROLE;
    booking?: Types.ObjectId[];
    guides?: Types.ObjectId[];
}