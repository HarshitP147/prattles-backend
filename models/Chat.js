import { Schema, model } from "mongoose";

import generateId from "../utils/generateId.js";

const chatSchema = new Schema({
    _id: String,
    name: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    avatarUrl: String,
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    _id: true,
})

const Chat = model("Chat", chatSchema);
export default Chat;