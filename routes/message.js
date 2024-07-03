import { Router } from "express";

import Chat from "../models/Chat.js";

const messageRoute = Router();

messageRoute.get("/:chatId", async (req, res) => {
    const chatId = req.params.chatId;

    const chatInfo = await Chat.findOne({
        chatId: chatId
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

});

export default messageRoute;