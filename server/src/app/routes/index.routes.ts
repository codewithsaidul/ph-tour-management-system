import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.route";
import { AuthRouters } from "../Modules/auth/auth.route";
import { DivisionRouters } from "../Modules/division/division.route";
import { TourRouters } from "../Modules/tour/tour.route";
import { BookingRouters } from "../Modules/booking/booking.route";
import { PaymentRouters } from "../Modules/payment/payment.routes";
import { OtpRoutes } from "../Modules/otp/otp.route";
import { StatsRoutes } from "../Modules/stats/stats.route";


export const router = Router();


const modulesRoute = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRouters
    },
    {
        path: "/division",
        route: DivisionRouters
    },
    {
        path: "/tour",
        route: TourRouters
    },
    {
        path: "/booking",
        route: BookingRouters
    },
    {
        path: "/payment",
        route: PaymentRouters
    },
    {
        path: "/otp",
        route: OtpRoutes
    },
    {
        path: "/stats",
        route: StatsRoutes
    }
]


modulesRoute.forEach(route => {
    router.use(route.path, route.route)
})

