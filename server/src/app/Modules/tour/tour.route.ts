import { Router } from "express";
import { chechAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ROLE } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { createToureZodSchema, updateToureZodSchema } from "./tour.validation";
import { TourTypeController } from "./tourTypes/tourTypes.controller";
import { createTourTypeZodSchema } from "./tourTypes/tourTypes.validation";

const router = Router();

router.post(
  "/create",
  validateRequest(createToureZodSchema),
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourController.createTour
);
router.get(
  "/",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourController.getAllTour
);
router.patch(
  "/:id",
  validateRequest(updateToureZodSchema),
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourController.updateTour
);
router.delete(
  "/:id",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourController.deleteTour
);

// ================== tour type
router.post(
  "/create-tour-type",
  validateRequest(createTourTypeZodSchema),
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourTypeController.createTourType
);

router.get(
  "/tour-types",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourTypeController.getAllTourType
);
router.patch(
  "/tour-types/:id",
  validateRequest(createTourTypeZodSchema),
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourTypeController.updateTourType
);
router.delete(
  "/tour-types/:id",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourTypeController.deleteTourType
);

export const tourRouter = router;
