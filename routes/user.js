import { Router } from "express";

import User from "../models/User.js";

const userRoute = Router();

userRoute.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({
            userId: userId
        }).populate({
            path: "chats",
            select: "chatId chatType lastMessage participants",
            populate: [{
                path: "participants",
                select: "userId name avatarUrl"
            },
            {
                path: "lastMessage",
                select: "sender content.text createdAt",
                populate: {
                    path: "sender",
                    select: "userId name avatarUrl"
                }
            },]

        })

        const processedChats = user.chats.map(chat => {
            const otherParticipants = chat.participants.filter(participant => participant.userId !== userId)

            // clone the chat object
            return {
                ...chat.toObject(),
                participants: otherParticipants
            }
        })

        return res.status(200).json({
            email: user.email,
            name: user.name,
            profileUrl: user.avatarUrl,
            chats: processedChats
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            chats: []
        })
    }
})


export default userRoute;