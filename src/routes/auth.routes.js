import { Router } from "express";

import { authPost } from "../controllers/auth.controllers.js";

const authRoute = Router({
    caseSensitive: false,
    strict: true
})

authRoute.get("/", (_, res) => {
    res.json({
        'Auth': 'Google OAuth 2.0'
    })
})

authRoute.post("/", authPost);


export default authRoute;