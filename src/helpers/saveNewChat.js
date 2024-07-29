import { startSession } from "mongoose";

import generateId from '../utils/generateId.js';

import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from '../models/Message.js';

async function saveNewChat(fromId, toId, message) {

    const fromUser = await User.findOne({ userId: fromId });
    const toUser = await User.findOne({ userId: toId })

    // implementing sessions to follow all or none property
    const session = await startSession()

    session.startTransaction();

    try {
        const chatId = generateId("cht");
        const messageId = generateId("msg");

        const newMessage = new Message({
            messageId: messageId,
            content: { text: message },
            sender: fromUser,
        })

        let participants = [fromUser._id];

        if (fromUser._id !== toUser._id) {
            participants.push(toUser._id);
        }

        const newChat = new Chat({
            chatId: chatId,
            participants: participants,
            messages: [newMessage],
            lastMessage: newMessage,
        })

        await newMessage.save({
            session: session
        })

        await newChat.save({
            session: session
        })

        await User.findOneAndUpdate({ userId: fromId },
            {
                $addToSet: { chats: newChat._id },
            }, { session: session }
        )

        if (fromId !== toId) {
            await User.findOneAndUpdate({ userId: toId },
                {
                    $addToSet: { chats: newChat._id },
                }, { session: session }
            )
        }

        await session.commitTransaction()
        session.endSession();

    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        session.endSession()
    }
}
export default saveNewChat;