import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisonZodSchema, updateDivisonZodSchema } from "./division.validation";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";
import { DivisionController } from "./division.controller";


const router = Router();



router.post("/create", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), validateRequest(createDivisonZodSchema), DivisionController.createDivision)
router.get("/", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.getAllDivision)

router.get("/:slug", DivisionController.getSingleDivision)

router.patch("/:id", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),  validateRequest(updateDivisonZodSchema),  DivisionController.updateDivision)
router.delete("/:id", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.deleteDivision)


export const DivisionRouters = router