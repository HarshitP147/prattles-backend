import { startSession } from "mongoose";

import User from "../models/User.js";
import Chat from "../models/Chat.js";

async function saveNewChat(fromId, toId) {
    const fromUser = await User.findById(fromId);
    const toUser = await User.findById(toId);


    // implementing sessions to follow all or none property
    const session = await startSession()

    session.startTransaction();

    try {
        const chatId = generateId('cht');

        const newChat = new Chat({
            _id: chatId,
            createdAt: Date.now,
            participants: [fromUser, toUser],
        })

        await newChat.save()

        await User.updateOne(
            { _id: fromUser._id },
            {
                $addToSet: { chats: newChat._id }
            },
            { session: session }
        )

        await User.updateOne(
            { _id: toUser._id },
            { $addToSet: { chat: newChat._id } },
            { session: session }
        )

        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        await session.abortTransaction();
        session.endSession()
    }
}
export default saveNewChat;