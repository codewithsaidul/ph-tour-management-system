import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  const newUserInLastSevenDaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUserInLastThirtyDaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const userByRolePromise = User.aggregate([
    // stage 1 : Grouping user by role and count total users in each role
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUserInLastSevenDays,
    newUserInLastThirtyDays,
    userByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    newUserInLastSevenDaysPromise,
    newUserInLastThirtyDaysPromise,
    userByRolePromise,
  ]);

  return {
      totalUsers,
      totalActiveUsers,
      totalInActiveUsers,
      totalBlockedUsers,
      newUserInLastSevenDays,
      newUserInLastThirtyDays,
      userByRole
  };
};

const getTourStats = async () => {
  return {};
};

const getBookingStats = async () => {
  return {};
};

const getPaymentStats = async () => {
  return {};
};

export const StatsServices = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
