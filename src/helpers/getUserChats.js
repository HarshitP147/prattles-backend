import User from "../models/User.js";

async function getUserChats(userId) {
    const userChats = await User.findOne({
        userId: userId
    })
        .select('chats')
        .populate({
            path: "chats",
            select: "chatId chatType  participants",
            options: {
                sort: {
                    updatedAt: -1
                }
            },
            populate: [{
                path: "participants",
                select: "userId name email avatarUrl"
            },]
        });

    const processedChats = userChats.chats.map(chat => {
        const participantsExceptSelf = chat.participants.filter(participant => participant.userId !== userId);

        if (participantsExceptSelf.length === 0) {
            return {
                ...chat.toObject()
            }
        }

        return {
            ...chat.toObject(),
            participants: participantsExceptSelf
        }
    })

    return processedChats;
}
export default getUserChats;