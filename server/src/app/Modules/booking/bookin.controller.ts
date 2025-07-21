/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const booking = await BookingServices.createBooking(
      req.body,
      decodedToken._id
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  }
);

const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const query = req.query;
    const booking = await BookingServices.getUserBookings(query as Record<string, string>, decodedToken._id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Bookings retrive successfully",
      data: booking,
    });
  }
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const booking = await BookingServices.getAllBookings(query as Record<string, string>);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Bookings retrive successfully",
      data: booking,
    });
  }
);

const getBookingById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId
    const booking = await BookingServices.getBookingById(bookingId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking retrive successfully",
      data: booking,
    });
  }
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    const booking = await BookingServices.updateBookingStatus(bookingId, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking status has been updated successfully",
      data: booking,
    });
  }
);

export const BookingController = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
};
