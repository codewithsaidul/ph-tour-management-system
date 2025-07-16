/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { TourTypeServices } from "./tourTypes.service";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes"

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourTypeServices.createTourType(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour Type has been created successfully!",
      data: tourType,
    });
  }
);


const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourTypeServices.getAllTourType();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Tour Type has been retrive successfully!",
      data: tourType,
    });
  }
);





export const TourTypeController = {
  createTourType, getAllTourType
};
