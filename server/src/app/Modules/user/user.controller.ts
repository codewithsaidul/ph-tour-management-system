/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";
import { IUSER } from "./user.interface";

// ===================== add new user
const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const payload: IUSER = {
      ...req.body,
      picture: req.file?.path,
    };

    const user = await UserServices.createUser(payload);

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
    const query = req.query;
    const result = await UserServices.getAllUsers(
      query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users retrived successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

// =========================== get me
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your profile retrived successfully!",
      data: result.data,
    });
  }
);


// =========================== get single user
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await UserServices.getSingleUser(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrived successfully!",
      data: result.data,
    });
  }
);

// ===================== add new user
const updateUserInfo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user as JwtPayload;

    const payload: IUSER = {
      ...req.body,
      picture: req.file?.path,
    };

    const user = await UserServices.updateUserInfo(
      userId,
      payload,
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
  getMe,
  getSingleUser,
  updateUserInfo,
};
