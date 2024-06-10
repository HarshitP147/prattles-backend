import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    _id: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    content: [{
        text: String,
        images: [{
            // can be a single image or multiple images
            type: Schema.Types.ObjectId,
            ref: "Image"
        }]
    }],
    repliedTo: {
        // replied to their message
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
}, {
    _id: false,
    timestamps: true
});

const Message = model("Message", messageSchema);
export default Message;