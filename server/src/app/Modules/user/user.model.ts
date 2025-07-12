import { model, Schema } from "mongoose";
import { IAUTHPROVIDER, IsActive, IUSER, ROLE } from "./user.interface";



const authProviderSchema = new Schema<IAUTHPROVIDER>({
    provider: { type: String, required: true},
    providerId: { type: String, required: true}
}, {
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUSER>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);




export const User = model<IUSER>("User", userSchema)
