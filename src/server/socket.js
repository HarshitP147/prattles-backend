
import User from "../models/User.js";

import saveNewChat from '../helpers/saveNewChat.js';
import getUserChats from "../helpers/getUserChats.js";

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

            try {
                await saveNewChat(fromId, toId, message)
            } catch (err) {
                socket.emit('error', err);
            }

        })

        socket.on("joinRoom", roomInfo => {
            socket.join(roomInfo.chatId)
        });

        socket.on('chatList', async (userId, callback) => {

            try {
                const processedChats = await getUserChats(userId);

                callback(processedChats);
            } catch (err) {
                callback(err);
            }

        })

        socket.on('chat', async (chatInfo) => {
            console.log(chatInfo)
        })

        socket.on("leaveRoom", roomInfo => {
            socket.leave(roomInfo.chatId);
        });


    })

}
