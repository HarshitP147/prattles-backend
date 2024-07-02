
import User from "./models/User.js";
import Chat from "./models/Chat.js";
import Message from "./models/Message.js";

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

            // await saveNewChat(fromId, toId, message)
            saveNewChat(fromId, toId, message)
                .then(async () => {
                    const user = await User.findOne({ userId: fromId })
                        .populate({
                            path: 'chats',
                            select: 'chatId chatType lastMessage'
                        })

                    const chats = user.chats;

                    socket.emit("updateChat", chats);

                })
                .catch(err => {
                    socket.emit("error", "Already in contacts");
                })
        })

        socket.on("joinRoom", roomInfo => {
            socket.join(roomInfo.chatId)
            // console.log(`User joined room ${roomInfo.chatId}`)
        });

        socket.on("leaveRoom", roomInfo => {
            socket.leave(roomInfo.chatId);
            // console.log(`User left room ${roomInfo.chatId}`)
        });

        socket.on('message', async (messageInfo) => {
            console.log(messageInfo);




        })
    })

}
