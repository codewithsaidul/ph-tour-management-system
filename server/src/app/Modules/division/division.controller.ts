/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { DivisionServices } from "./division.service";


const createDivision = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const division = await DivisionServices.createDivision(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division has been created successfully!",
      data: division,
    });
  }
);


const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionServices.getAllDivision();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Division retrived successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);


const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id
    const divisionData = req.body
    const division = await DivisionServices.updateDivision(divisionId, divisionData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division has been updated successfully!!",
      data: division,
    });
  }
);



export const DivisionController = {
    createDivision, getAllDivision, updateDivision
}