import z from "zod";
import { BookingStatus } from "./booking.interface";



export const createBookingZodSchema = z.object({
    tour: z.string(),
    guestCount: z.number().int().positive()
});




export const updateBookingZodSchema = z.object({
    status: z.enum(Object.values(BookingStatus) as [string])
})