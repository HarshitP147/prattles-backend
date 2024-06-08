import { io } from "./server.js";

import generateId from "./utils/generateId.js";

import User from "./models/User.js";
import Chat from "./models/Chat.js";

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

        })
    })
}
