import { Types } from "mongoose";

export enum BookingStatus {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED"
}


export interface IBooking {
    user: Types.ObjectId;
    tour: Types.ObjectId;
    payment?: Types.ObjectId;
    guestCount: number;
    status:     BookingStatus
}