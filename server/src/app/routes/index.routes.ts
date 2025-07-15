import { Router } from "express";
import { userRoutes } from "../Modules/user/user.route";
import { authRouter } from "../Modules/auth/auth.route";
import { divisionRouter } from "../Modules/division/division.route";


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
]


modulesRoute.forEach(route => {
    router.use(route.path, route.route)
})

