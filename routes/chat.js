import { Router } from "express";

import Chat from '../models/Chat.js';

const chatRoute = Router();

// route to return all the messages
chatRoute.get("/:chatId", async (req, res) => {
    const chatInfo = await Chat.findOne({
        chatId: req.params.chatId
    })
        .select('messages')
        .populate('messages', 'sender content createdAt')

    res.status(200).json(chatInfo);
})

export default chatRoute