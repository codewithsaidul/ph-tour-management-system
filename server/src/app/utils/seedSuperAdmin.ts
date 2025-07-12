import bcrypt from "bcryptjs";
import { envVars } from "../config/env";
import { IAUTHPROVIDER, IUSER, ROLE } from "../Modules/user/user.interface";
import { User } from "../Modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      return null;
    }

    const hashPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASS,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAUTHPROVIDER = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const superAdminInfo: IUSER = {
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashPassword,
      role: ROLE.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    await User.create(superAdminInfo);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
