import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { chechAuth } from "../../middlewares/checkAuth";
import { ROLE } from "../user/user.interface";


const router = Router();



router.post("/init-payment/:bookingId", PaymentController.initPayment)
router.post("/success", PaymentController.successPayment)
router.post("/fail", PaymentController.failPayment)
router.post("/cancel", PaymentController.cancelPayment)
router.get("/invoice/:paymentId", chechAuth(...Object.values(ROLE)), PaymentController.getInvoiceDownloadUrl)


export const PaymentRouters = router;