
import User from "../models/User.js";

import saveNewChat from '../helpers/saveNewChat.js';
import getUserChats from "../helpers/getUserChats.js";
import newMessage from "../helpers/newMessage.js";

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

        socket.on("joinRoom", chatId => {
            socket.join(chatId);
        });

        socket.on('chatList', async (userId) => {

            try {
                const processedChats = await getUserChats(userId);

                socket.emit('updateChatList', processedChats);
                // callback(processedChats);
            } catch (err) {
                socket.emit('updateChatList', []);
                console.error(err);
            }

        })

        socket.on('chat', async (chatInfo) => {

            const newMessageResponse = await newMessage(chatInfo);

            io.to(chatInfo.chatId).emit('newMessage', newMessageResponse);
        })

        socket.on("leaveRoom", chatId => {
            socket.leave(chatId);
        });


    })

}
