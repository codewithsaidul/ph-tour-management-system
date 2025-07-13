import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { AppError } from "../errorHelpers/AppError";
import { IsActive, IUSER } from "../Modules/user/user.interface";
import { User } from "../Modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes"



export const createUserTokens = (user: Partial<IUSER>) => {
      const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };
    
      const accessToken = generateToken(
        jwtPayload,
        envVars.JWT_ACCESS_SECRET,
        envVars.JWT_ACCESS_EXPIRE
      );
    
    
      const refreshToken = generateToken(
        jwtPayload,
        envVars.JWT_REFRESH_SECRET,
        envVars.JWT_REFRESH_EXPIRE
      );

    return {
        accessToken, refreshToken
    }
}



export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
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
    throw new AppError(httpStatus.NOT_FOUND, "User deleted");
  }

  const jwtPayload = {
    _id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRE
  );

  return accessToken
}
