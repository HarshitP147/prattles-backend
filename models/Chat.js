import { Schema, model } from "mongoose";

import generateId from "../utils/generateId";

const chatSchema = new Schema({
    _id: generateId('cht'),
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
})

const Chat = model("Chat", chatSchema);
export default Chat;