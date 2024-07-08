import { Router } from "express";

import { getUser } from "../controllers/user.controllers.js";

const userRoute = Router();

userRoute.get("/:userId", getUser);


export default userRoute;