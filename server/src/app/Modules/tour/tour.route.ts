import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema } from "./tourTypes/tourTypes.validation";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";
import { TourTypeController } from "./tourTypes/tourTypes.controller";


const router = Router();




router.post("/create-tour-type", validateRequest(createTourTypeZodSchema), chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN), TourTypeController.createTourType);

router.get("/tour-types", chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN), TourTypeController.getAllTourType)
router.patch("/tour-types/:id", validateRequest(createTourTypeZodSchema), chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN), TourTypeController.updateTourType)
// {
//    "name": "Dhaka Division"
// }

export const tourRouter = router;