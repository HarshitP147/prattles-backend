import { Schema, model } from "mongoose";

import generateId from "../utils/generateId.js";

const userSchema = new Schema({
    _id: String,
    name: String,
    email: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    avatarUrl: String,
    chats: [{
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    }]
}, {
    _id: true
});

const User = model('User', userSchema);
export default User;