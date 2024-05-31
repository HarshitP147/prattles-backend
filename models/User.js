import { Schema, model } from "mongoose";

import generateId from "../utils/generateId";

const userSchema = new Schema({
    _id: generateId('usr'),
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
});

const User = model('User', userSchema);
export default User;