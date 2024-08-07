import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    chatId: String,
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
}, {
    _id: true,
    timestamps: true
})

const Chat = model("Chat", chatSchema);
export default Chat;