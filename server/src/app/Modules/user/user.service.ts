import { IUSER } from "./user.interface";
import { User } from "./user.model";

// ===================== add new user
const createUser = async (payload: Partial<IUSER>) => {
  const { name, email } = payload;

  const user = await User.create({ name, email });


  return user
};



// =========================== get all user 
const getAllUsers = async () => {
  const users = await User.find({});
  const total  = await User.countDocuments()
  return {
    data: users,
    meta: {
      total: total
    }
  };
}



export const UserServices = {
    createUser, getAllUsers
}
