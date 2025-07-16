import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisonZodSchema, updateDivisonZodSchema } from "./division.validation";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";
import { DivisionController } from "./division.controller";


const router = Router();



router.post("/create", validateRequest(createDivisonZodSchema), chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.createDivision)
router.get("/", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.getAllDivision)
router.patch("/:id", validateRequest(updateDivisonZodSchema), chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.updateDivision)
router.delete("/:id", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.deleteDivision)


export const divisionRouter = router