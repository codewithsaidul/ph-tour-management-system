/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { ITour } from "./tour.interface";

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };

    const tour = await TourServices.createTour(payload);

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
    const query = req.query;

    const result = await TourServices.getAllTour(
      query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All Tour retrived successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.id;

    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };

    const tour = await TourServices.updateTour(tourId, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour has been updated successfully!",
      data: tour,
    });
  }
);

const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.id;
    await TourServices.deleteTour(tourId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tour has been deleted successfully!",
      data: null,
    });
  }
);

export const TourController = {
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
};
