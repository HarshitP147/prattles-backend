import { Router } from "express";

import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";
import generateId from "../utils/generateId.js";

const authRoute = Router({
    caseSensitive: false,
    strict: true
})

authRoute.get("/", (_, res) => {
    res.json({
        'Auth': 'Google OAuth 2.0'
    })
})

authRoute.post("/", async (req, res) => {

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
            "Authorization": `Bearer ${token}`
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
                _id: userId,
                email: userData.email,
                name: userData.name,
                avatarUrl: userData.picture,
            })

            await newUser.save()

            const { token, tokenExpiry } = generateToken(newUser.email, newUser._id);

            return res.status(200).json({
                message: 'User saved succesfully',
                token: token,
                tokenExpiry: tokenExpiry,
                userId: newUser._id,
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

        const { token, tokenExpiry } = generateToken(existingUser.email, existingUser._id);

        return res.status(200).json({
            message: "User signed in succesfully",
            userId: existingUser._id,
            token: token,
            tokenExpiry: tokenExpiry
        })
    }
})


export default authRoute;