import { sendEmail } from './../../utils/sendEmail';
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { IAUTHPROVIDER, IsActive, IUSER } from "../user/user.interface";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import jwt from "jsonwebtoken"




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

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
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

  user?.save();

  return true;
};

const setPassword = async (userId: string, planPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      400,
      "You have already set your password. Now you can change the password from your profile password updated if you needed"
    );
  }

  const hashedPassword = await bcrypt.hash(
    planPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAUTHPROVIDER = {
    provider: "credentials",
    providerId: "user.email",
  };

  const auths: IAUTHPROVIDER[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(404, "User not found!");
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

  const jwtPayload = {
    _id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m"
  })

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Passwort Reset",
    templateName: "forgatePassword", 
    templateData: {
      name: isUserExist.name,
      resetUILink
    }
  })

  await isUserExist.save();
};

const resetPassword = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {


  if (payload.id !== decodedToken._id) {
    throw new AppError(401, "You cann't reset your password")
  }

  const isUserExist = await User.findById(decodedToken._id);

  if (!isUserExist) {
    throw new AppError(404, "User not found")
  }


  isUserExist.password = await bcrypt.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  isUserExist?.save();

  return true;
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  setPassword,
  resetPassword,
  forgotPassword,
};
