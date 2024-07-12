import Chat from '../models/Chat.js'

async function getChatMessages(req, res) {
    const chatId = req.params.chatId;

    // render all the chat messages from this chat route
    try {
        const chatMessages = await Chat.findOne({
            chatId: chatId
        })
            .select('messages')
            .populate({
                path: 'messages',
                select: 'sender content createdAt',
                populate: {
                    path: "sender",
                    select: 'userId'
                }
            })



        res.status(200).json(chatMessages);

    } catch (err) {
        console.error(err);
    }

}
export { getChatMessages }