import { startSession,Types } from "mongoose";

import generateId from './generateId.js';

import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from '../models/Message.js';

async function saveNewChat(fromId, toId, message) {
    const fromUser = await User.findById(fromId);
    const toUser = await User.findById(toId);

    // implementing sessions to follow all or none property
    const session = await startSession()

    session.startTransaction();

    try {
        const chatId = generateId("cht");
        const messageId = generateId("msg");

        const newMessage = new Message({
            _id: messageId,
            content: [{
                text: message
            }],
            sender: fromUser,
        })

        const newChat = new Chat({
            _id: chatId,
            participants: [fromUser, toUser],
            messages: [newMessage],
            lastMessage: newMessage
        })

        await newMessage.save({
            session: session
        })

        await newChat.save({
            session: session
        })

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

        return fromUser.chats;

    } catch (err) {
        await session.abortTransaction();
        session.endSession()
        console.error(err);
    }
}
export default saveNewChat;