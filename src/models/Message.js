import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    messageId: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        text: String,
        images: [{
            // can be a single image or multiple images
            type: Schema.Types.ObjectId,
            ref: "Image",
            required: false
        }]
    },
    repliedTo: {
        // replied to their message
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
}, {
    _id: true,
    timestamps: true
});

const Message = model("Message", messageSchema);
export default Message;