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




const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id
    const tourType = await TourTypeServices.updateTourType(tourTypeId, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour Type has been updated successfully!",
      data: tourType,
    });
  }
);




const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id
    await TourTypeServices.deleteTourType(tourTypeId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour Type has been deleted successfully!",
      data: null,
    });
  }
);



export const TourTypeController = {
  createTourType, getAllTourType, updateTourType, deleteTourType
};
