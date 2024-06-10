
import User from "./models/User.js";

import saveNewChat from './utils/saveNewChat.js';

export default function configureSockets(io) {

    io.on("connection", (socket) => {
        socket.on('search', async (query) => {
            const contacts = await User.find({
                email: {
                    $regex: query,
                    $options: 'i'
                }
            }).select(['userId', 'name', 'avatarUrl', 'email'])

            socket.emit('userSearchResults', contacts);
        })

        socket.on('newChat', async (info) => {

            // saving to new Chats
            const fromId = info.from;
            const toId = info.to;
            const message = info.message;

            await saveNewChat(fromId, toId, message);

            const user = await User.findOne({ userId: fromId })

            const chats = user.chats;

            socket.emit("updateChat",chats);
        })
    })
}
