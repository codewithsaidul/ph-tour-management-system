/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { AppError } from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setcookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userToken";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    // setting a accesstoken or refress token
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged In successfully!",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You haven't any Refresh token"
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    // setting a accesstoken
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token retrive successfully!",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged Out successfully!",
      data: null,
    });
  }
);



const resetPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {

    const decodedToken = req.user
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password change successfully!",
      data: null,
    });
  }
);



const googleCallbackController = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : "" ;
    const user = req.user;


    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }


    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1)
    }



    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: "Password change successfully!",
    //   data: null,
    // });

    return res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
};
