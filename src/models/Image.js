import { Schema, model } from "mongoose";

const imageSchema = new Schema({
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    imageContent: {
        data: Buffer,
        contentType: String,
        required: true
    },
    imageType: {
        type: String,
        enum: ['avatar', 'chat'],
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true
    }
})

const Image = model("Image", imageSchema);