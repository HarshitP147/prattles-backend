import { Router } from "express";

import { getChatMessages } from "../controllers/chat.controllers.js";

const chatRoute = Router({
    caseSensitive: false,
    strict: true
});

chatRoute.get("/:chatId", getChatMessages);

export default chatRoute