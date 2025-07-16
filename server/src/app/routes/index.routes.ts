import { Router } from "express";
import { userRoutes } from "../Modules/user/user.route";
import { authRouter } from "../Modules/auth/auth.route";
import { divisionRouter } from "../Modules/division/division.route";
import { tourRouter } from "../Modules/tour/tour.route";


export const router = Router();


const modulesRoute = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/division",
        route: divisionRouter
    },
    {
        path: "/tour",
        route: tourRouter
    },
]


modulesRoute.forEach(route => {
    router.use(route.path, route.route)
})

