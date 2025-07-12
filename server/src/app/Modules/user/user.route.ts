import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get(
  "/all-users",
  chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  UserController.getAllUsers
);
router.patch("/:id", validateRequest(updateUserZodSchema), chechAuth(...Object.values(ROLE)), UserController.updateUserInfo)
export const userRoutes = router;
