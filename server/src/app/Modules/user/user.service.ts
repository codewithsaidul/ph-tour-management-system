import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import { IAUTHPROVIDER, IUSER, ROLE } from "./user.interface";
import { User } from "./user.model";

// ===================== add new user
const createUser = async (payload: Partial<IUSER>) => {
  const { email, password, ...other } = payload;

  // const isUserExist = await User.findOne({ email });

  // if (isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  // }

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAUTHPROVIDER = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...other,
  });

  return user;
};

// =========================== get all user
const getAllUsers = async () => {
  const users = await User.find({});
  const total = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: total,
    },
  };
};

// =========================== update user Details
const updateUserInfo = async (
  userId: string,
  payload: Partial<IUSER>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }

  if (payload.role) {
    if (decodedToken.role === ROLE.USER || decodedToken.role === ROLE.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your not authorized to perform this action"
      );
    }
    if (payload.role === ROLE.SUPER_ADMIN && decodedToken.role === ROLE.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your not authorized to perform this action"
      );
    }

    if (isUserExist.email === decodedToken.email) {
      if (decodedToken.role === ROLE.ADMIN) {
        if (payload.role === ROLE.USER || payload.role === ROLE.GUIDE) {
          throw new AppError(
          httpStatus.FORBIDDEN,
          "You cann't change your role"
        );
        }
      }
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === ROLE.USER || decodedToken.role === ROLE.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your not authorized to perform this action"
      );
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const updateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updateUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUserInfo,
};
