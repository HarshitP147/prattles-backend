import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
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
        ref: "Message"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = model("Message", messageSchema);
export default Message;