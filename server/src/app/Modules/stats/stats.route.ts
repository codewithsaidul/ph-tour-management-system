import { Router } from "express";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();





router.get(
  "/user",
  chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  StatsController.getUserStats
);


router.get(
  "/tour",
  chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  StatsController.getTourStats
);


router.get(
  "/booking",
  chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  StatsController.getBookingStats
);


router.get(
  "/payment",
  chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  StatsController.getPaymentStats
);


export const StatsRoutes = router;
