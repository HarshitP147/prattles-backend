import { Router } from "express";

import { io } from "../server.js";
import User from "../models/User.js";

const userRoute = Router();

userRoute.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({
            userId: userId
        })


        return res.status(200).json({
            email: user.email,
            name: user.name,
            profileUrl: user.avatarUrl,
            chats: user.chats
        })

    } catch (err) {

        return res.status(500).json({
            message: "Internal server error",
            chats: []
        })
    }
})


export default userRoute;