import { Router } from "express";

import Chat from '../models/Chat.js';
import User from '../models/User.js';

const chatRoute = Router();

// common route for both users and chats to request
chatRoute.get("/:reqId", async (req, res) => {
    const reqId = req.params.reqId;

    const idType = reqId.split('-')[0]

    // depening upon who requested, we send responses
    if (idType === 'cht') {
        const chatInfo = await Chat.findOne({
            chatId: reqId
        })
            .select('messages')
            .populate({
                path: "messages",
                select: "sender content createdAt",
                populate: {
                    path: "sender",
                    select: 'userId'
                }
            })
            .skip(7)

        res.status(200).json(chatInfo);
    }

    else if (idType === 'usr') {
        const userChats = await User.findOne({
            userId: reqId
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
                        select: "userId name avatarUrl"
                    }
                }]
            })

        res.status(200).json(userChats)
    }

})


export default chatRoute