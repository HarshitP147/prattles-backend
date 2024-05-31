import { Router } from "express";

import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";

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
    const email = req.body.email;
    const token = req.headers.authorization.split(' ')[1]

    // get user information about the user

    let statusCode;

    const existingUser = await User.findOne({
        email: email
    }).exec()

    if (existingUser === null) {
        // the user does not exists
        try {
            const fetchInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            })

            statusCode = fetchInfo.status;

            const userData = await fetchInfo.json()

            const newUser = new User({
                email: email,
                name: userData.name,
                avatarUrl: userData.picture,
            })

            await newUser.save({
                validateBeforeSave: true,
            })

            const { token, tokenExpiry } = generateToken(newUser.email, newUser._id);

            res.status(200).json({
                message: 'User saved succesfully',
                token: token,
                tokenExpiry: tokenExpiry
            })

        } catch (err) {
            console.error(err);

            res.status(statusCode).json({
                message: err.message || 'Could not save user'
            })
        }
    } else {
        // user already exists

        const { token, tokenExpiry } = generateToken(existingUser.email, existingUser._id);

        res.status(200).json({
            message: "User signed in succesfully",
            userId: newUser._id,
            token: token,
            tokenExpiry: tokenExpiry
        })
    }
})


export default authRoute;