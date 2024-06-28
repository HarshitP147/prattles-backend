import { Router } from "express";

import Chat from '../models/Chat.js';

const chatRoute = Router();

// route to return all the messages
chatRoute.get("/:chatId", async (req, res) => {
    const chatInfo = await Chat.findOne({
        chatId: req.params.chatId
    })
        .select('messages')
        .populate({
            path: "messages",
            select: "sender content createdAt",
            populate: {
                path: 'sender',
                select: 'userId'
            }
        })

    res.status(200).json(chatInfo);
})

export default chatRoute