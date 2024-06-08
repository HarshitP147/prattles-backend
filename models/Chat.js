import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    _id: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    _id: true,
})

const Chat = model("Chat", chatSchema);
export default Chat;