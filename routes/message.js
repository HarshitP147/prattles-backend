import { Router } from "express";

import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

const messageRoute = Router();

messageRoute.get("/:chatId", async (req, res) => {
    const chatId = req.params.chatId;

    const chatInfo = await Chat.findOne({
        chatId: chatId
    }, {
        _id: 0,
        __v: 0,
        participants: 0,
        createdAt: 0,
        lastMessage: 0,
        updatedAt: 0
    })
        .select('messages')
        .populate({
            path: "messages",
            select: "sender content createdAt",
            populate: {
                path: "sender",
                select: 'userId',
                model: 'User',
            },
            model: Message,
            strictPopulate: true,
        })

    res.status(200).json(chatInfo);

});

export default messageRoute;