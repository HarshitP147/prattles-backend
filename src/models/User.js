import { Schema, model } from "mongoose";

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    name: String,
    email: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    avatarUrl: String,
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
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