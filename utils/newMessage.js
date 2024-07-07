import { startSession } from "mongoose";

import generateId from "./generateId.js";

import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";


async function newMessage(messageInfo) {

    const { chatId, content, sender } = messageInfo

    const senderId = await User.findOne({
        userId: sender
    })

    const session = await startSession();
    session.startTransaction();

    try {
        const messageId = generateId('msg');

        const newMsg = new Message({
            messageId: messageId,
            sender: senderId,
            content: {
                text: content.text,
            }
        })

        await newMsg.save({
            session: session
        })


        await Chat.updateOne({
            chatId: chatId,
        }, {
            $push: {
                messages: newMsg._id
            },
            lastMessage: newMsg._id,
        }, {
            session: session
        })

        await session.commitTransaction()
        session.endSession();

        // return a promise with some message properties to update immediately
        return Promise.resolve();

    } catch (err) {
        console.log('Aborting transaction');
        console.error(err);
        await session.abortTransaction()
        // session.endSession();
    }
}
export default newMessage;