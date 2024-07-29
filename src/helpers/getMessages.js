import Chat from "../models/Chat.js";
import Message from "../models/Message.js";


async function getMessages(chatId) {
    // get all the messages

    const chatMessages = await Chat.findOne({
        chatId: chatId
    })
        .select('messages')
        .populate({
            path: 'messages',
            select: 'sender content repliedTo',
            populate: {
                path: 'sender',
                select: 'userId'
            }
        })

}