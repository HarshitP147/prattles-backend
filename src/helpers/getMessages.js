import Chat from "../models/Chat.js";

export default async function getMessages(chatId) {
    // get all the messages

    const chatMessages = await Chat.findOne({
        chatId: chatId
    })
        .select('messages')
        .populate({
            path: 'messages',
            options: {
                createdAt: -1,
                // limit: 14,
            },
            select: 'sender content repliedTo',
            populate: {
                path: 'sender',
                select: 'userId'
            }
        })

    return chatMessages;
}