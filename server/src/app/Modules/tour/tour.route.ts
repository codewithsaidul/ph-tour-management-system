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
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  validateRequest(createToureZodSchema),
  TourController.createTour
);
router.get(
  "/",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourController.getAllTour
);


router.post(
  "/create-tour-type",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourTypeController.createTourType
);

router.get(
  "/tour-types",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourTypeController.getAllTourType
);



router.patch(
  "/:id",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  validateRequest(updateToureZodSchema),
  TourController.updateTour
);
router.delete(
  "/:id",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourController.deleteTour
);



router.patch(
  "/tour-types/:id",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourTypeController.updateTourType
);
router.delete(
  "/tour-types/:id",
  chechAuth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  TourTypeController.deleteTourType
);

export const TourRouters = router;
