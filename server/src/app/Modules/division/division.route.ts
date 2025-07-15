import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { divisonZodSchema } from "./division.validation";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";
import { DivisionController } from "./division.controller";


const router = Router();



router.post("/create", validateRequest(divisonZodSchema), chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.createDivision)
router.get("/", chechAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), DivisionController.getAllDivision)


export const divisionRouter = router