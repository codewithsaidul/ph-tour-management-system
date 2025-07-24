import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../Modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../Modules/user/user.interface";

export const chechAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new AppError(403, "Token not found");
    }

    const verifiedToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(403, "You are not authorized for this action");
    }

    const isUserExist = await User.findOne({
      email: verifiedToken.email,
    });

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
    }

    if (!isUserExist.isVerified) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Youre not verifed. Please verify first!"
      );
    }

    if (
      isUserExist.isActive === IsActive.BLOCKED ||
      isUserExist.isActive === IsActive.INACTIVE
    ) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `User has been ${isUserExist.isActive}. contact with our team`
      );
    }

    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "User is deleted");
    }

    req.user = verifiedToken;
    next();
  };
