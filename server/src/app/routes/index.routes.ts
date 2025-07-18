import { Router } from "express";
import { UserRoutes } from "../Modules/user/user.route";
import { AuthRouters } from "../Modules/auth/auth.route";
import { DivisionRouters } from "../Modules/division/division.route";
import { TourRouters } from "../Modules/tour/tour.route";


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
]


modulesRoute.forEach(route => {
    router.use(route.path, route.route)
})

