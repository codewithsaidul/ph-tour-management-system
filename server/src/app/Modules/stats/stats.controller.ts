/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsServices } from "./stats.service";





const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await StatsServices.getUserStats()

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Stats retrive successfully!",
      data: result,
    });
  }
);

const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour has been updated successfully!",
      data: null,
    });
  }
);

const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour has been updated successfully!",
      data: null,
    });
  }
);

const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour has been updated successfully!",
      data: null,
    });
  }
);



export const StatsController = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
