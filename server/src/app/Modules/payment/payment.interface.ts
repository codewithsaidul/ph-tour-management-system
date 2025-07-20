/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";



export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELLED = "CANCELLED",
    FAILED = "FAILDED",
    REFUNDED = "REFUNDED"
}


export interface IPayment {
    booking: Types.ObjectId;
    transactionId: string;
    amount: number;
    paymentGateWayData?: any;
    invocieUrl?: string;
    status: PaymentStatus
}