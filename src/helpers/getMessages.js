import Chat from "../models/Chat.js";

export default async function getMessages(chatId) {
    // get all the messages

    const chatMessages = await Chat.findOne({
        chatId: chatId
    })
        .select('messages')
        .populate({
            path: 'messages',
            select: 'sender content repliedTo createdAt ',
            populate: {
                path: 'sender',
                select: 'userId'
            }
        })

    return chatMessages;
}