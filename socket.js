
import User from "./models/User.js";

import saveNewChat from './utils/saveNewChat.js';

export default function configureSockets(io) {

    io.on("connection", (socket) => {
        console.log(`Client joined with client id:${socket.id}`)

        socket.on('search', async (query) => {
            const contacts = await User.find({
                email: {
                    $regex: query,
                    $options: 'i'
                }
            }).select(['_id', 'name', 'avatarUrl', 'email'])

            socket.emit('userSearchResults', contacts);
        })

        socket.on('newChat', async (info) => {

            // saving to new Chats
            const fromId = info.from;
            const toId = info.to;
            const message = info.message;

            try {
                const chats = saveNewChat(fromId, toId, message)

                socket.emit("updateChat", chats);

            } catch (err) {
                // return the old chats only
                const fromUser = await User.findById(fromId)

                socket.emit("updateChat",fromUser.chats);
            }

        })
    })
}
