/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourServices.createTour(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Tour has been created successfully!",
      data: tour,
    });
  }
);

const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await TourServices.getAllTour()


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Tour retrived successfully!",
      data: result.tour,
      meta: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      },
    });
  }
);


const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.id;
    const tour = await TourServices.updateTour(tourId, req.body)


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour has been updated successfully!",
      data: tour,
    });
  }
);

export const TourController = {
  createTour, getAllTour, updateTour
};
