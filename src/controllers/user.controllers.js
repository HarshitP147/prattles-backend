
import User from "../models/User.js";

async function getUser(req, res) {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({
            userId: userId
        })

        return res.status(200).json({
            email: user.email,
            name: user.name,
            profileUrl: user.avatarUrl,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            chats: []
        })
    }
}
export { getUser }