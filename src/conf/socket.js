
import User from "../models/User.js";

import saveNewChat from '../helpers/saveNewChat.js';

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
                    // update the user with new chats
                })
                .catch(err => {
                    socket.emit("error", "Already in contacts");
                })
        })

        socket.on("joinRoom", roomInfo => {
            socket.join(roomInfo.chatId)
        });

        socket.on('chatList', async (userId) => {
            const userChats = await User.findOne({
                userId: userId
            })
                .select("chats")
                .populate({
                    path: "chats",
                    select: "chatId chatType lastMessage participants",
                    populate: [{
                        path: "participants",
                        select: "userId name email avatarUrl"
                    },
                    {
                        path: "lastMessage",
                        select: "sender content.text createdAt",
                        populate: {
                            path: "sender",
                            select: "userId name"
                        }
                    }]
                })



            const processedChats = userChats.chats.map(chat => {
                const participantsExceptSelf = chat.participants.filter(participant => participant.userId !== userId);

                if (participantsExceptSelf.length === 0) {
                    return {
                        ...chat.toObject()
                    }
                }

                return {
                    ...chat.toObject(),
                    participants: participantsExceptSelf
                }

            })
        })

        socket.on("leaveRoom", roomInfo => {
            socket.leave(roomInfo.chatId);
        });


    })

}
