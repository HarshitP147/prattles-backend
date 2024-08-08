import User from "../models/User.js";

import generateId from "../utils/generateId.js";

async function authPost(req, res) {

    if (!req.headers.authorization) {
        return res.status(401).json({
            message: "No token provided"
        })
    }

    const token = req.headers.authorization.split(' ')[1]

    let statusCode;

    // get user information about the user
    const fetchInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            'Access-Control-Allow-Headers': '*'
        },
    })

    statusCode = fetchInfo.status;

    const userData = await fetchInfo.json()

    const existingUser = await User.findOne({
        email: userData.email
    })

    if (existingUser === null) {
        // the user does not exists
        try {
            const userId = generateId('usr');

            const newUser = new User({
                userId: userId,
                email: userData.email,
                name: userData.name,
                avatarUrl: userData.picture,
            })

            await newUser.save()

            return res.status(200).json({
                message: 'User saved succesfully',
                userId: newUser.userId,
            })

        } catch (err) {
            console.error(err);

            statusCode = statusCode || 500

            return res.status(statusCode).json({
                message: err.message || 'Could not save user'
            })
        }
    } else {
        // user already exists

        return res.status(200).json({
            message: "User signed in succesfully",
            userId: existingUser.userId,
        })
    }
}
export { authPost };