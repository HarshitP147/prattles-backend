import getMessages from '../helpers/getMessages.js';

async function getChatMessages(req, res) {
    const chatId = req.params.chatId;

    // render all the chat messages from this chat route
    try {
        const chatMessages = await getMessages(chatId)

        res.status(200).json(chatMessages);

    } catch (err) {
        console.error(err);
        // console.log('there is an error', err.name);
    }

}
export { getChatMessages }