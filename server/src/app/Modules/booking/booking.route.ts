import { Router } from "express";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema, updateBookingZodSchema } from "./booking.validation";
import { BookingController } from "./bookin.controller";


const router = Router();



// api/v1/booking
router.post("/", chechAuth(...Object.values(ROLE)), validateRequest(createBookingZodSchema), BookingController.createBooking);


// api/v1/booking
router.get("/", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), BookingController.getAllBookings);


// api/v1/booking/my-bookings
router.get("/my-bookings", chechAuth(...Object.values(ROLE)), BookingController.getUserBookings);


// api/v1/booking/bookingId
router.get("/:bookingId", chechAuth(...Object.values(ROLE)), BookingController.getBookingById);


// api/v1/booking/bookingId/status
router.patch("/:bookingId/status", chechAuth(...Object.values(ROLE)), validateRequest(updateBookingZodSchema), BookingController.updateBookingStatus);


export const BookingRouters = router;