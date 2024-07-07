
import User from "./models/User.js";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";

import saveNewChat from './utils/saveNewChat.js';
import newMessage from "./utils/newMessage.js";

export default function configureSockets(io) {

    io.on("connection", (socket) => {

        // works fine
        socket.on('search', async (query) => {
            const contacts = await User.find({
                email: {
                    $regex: query,
                    $options: 'i'
                }
            }).select(['userId', 'name', 'avatarUrl', 'email'])

            socket.emit('userSearchResults', contacts);
        })

        socket.on('newChat', async (newChat) => {
            // saving to new Chats
            const fromId = newChat.from;
            const toId = newChat.to;
            const message = newChat.message;

            // await saveNewChat(fromId, toId, message)
            saveNewChat(fromId, toId, message)
                .then(async () => {
                    // send the user new chat
                })
                .catch(err => {
                    socket.emit("error", "Already in contacts");
                })
        })

        socket.on("joinRoom", roomInfo => {
            socket.join(roomInfo.chatId)
        });

        socket.on("leaveRoom", roomInfo => {
            socket.leave(roomInfo.chatId);
        });


    })

}
