import { Router } from "express";

import Chat from '../models/Chat.js';

const chatRoute = Router();


chatRoute.get("/:chatId", async (req, res) => {
    const chatInfo = await Chat.findOne({
        chatId: req.params.chatId
    })

    console.log(chatInfo);

    res.status(200).json(chatInfo);
})

export default chatRoute