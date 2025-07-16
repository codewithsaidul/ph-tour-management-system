/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

// ===================== add new user
const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User has been created successfully!",
      data: user,
    });
  }
);

// =========================== get all user
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users retrived successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

// ===================== add new user
const updateUserInfo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.params.id;
    const updateData = req.body;
    const verifiedToken = req.user as JwtPayload;
    const user = await UserServices.updateUserInfo(
      userId,
      updateData,
      verifiedToken
    );


    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User has been updated successfully!",
      data: user,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUserInfo,
};
