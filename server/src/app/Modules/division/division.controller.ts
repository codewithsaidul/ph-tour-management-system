import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { DivisionServices } from "./division.service";


const createDivision = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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


export const DivisionController = {
    createDivision
}