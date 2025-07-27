import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserZodSchema),
  UserController.createUser
);


router.get(
  "/all-users",
  chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  UserController.getAllUsers
);


router.get(
  "/me",
  chechAuth(...Object.values(ROLE)),
  UserController.getMe
);


router.get("/:id", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), UserController.updateUserInfo)

router.patch("/:id", chechAuth(...Object.values(ROLE)), multerUpload.single("file"), validateRequest(updateUserZodSchema), UserController.updateUserInfo)
export const UserRoutes = router;
