import { Router } from "express";

import Chat from '../models/Chat.js';
import User from '../models/User.js';

const chatRoute = Router();

// common route for both users and chats to request
chatRoute.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    const userChats = await User.findOne({
        userId: userId
    })
        .select("chats")
        .populate({
            path: "chats",
            select: "chatId chatType lastMessage participants",
            populate: [{
                path: "participants",
                select: "userId name email avatarUrl"
            },
            {
                path: "lastMessage",
                select: "sender content.text createdAt",
                populate: {
                    path: "sender",
                    select: "userId name"
                }
            }]
        })

    const processedChats = userChats.chats.map(chat => {
        const participantsExceptSelf = chat.participants.filter(participant => participant.userId !== userId);

        return {
            ...chat.toObject(),
            participants: participantsExceptSelf
        }

    })

    res.status(200).json(processedChats)
})


export default chatRoute