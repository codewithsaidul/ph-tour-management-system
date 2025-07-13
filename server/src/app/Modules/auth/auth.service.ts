import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { IUSER } from "../user/user.interface";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUSER>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const { accessToken, refreshToken } = createUserTokens(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...user } = isUserExist.toObject();

  return {
    accessToken,
    refreshToken,
    user: user,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return { accessToken: newAccessToken };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
  }


  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old Password Doesn't match");
  }

  user.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );


  user?.save()

  return true;
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
