import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv'

const { sign } = jsonwebtoken
const { config } = dotenv

config();

const secret = process.env.JWT_SECRET;

export default function generateToken(email, id) {
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000

    const token = sign({
        email: email,
        id: id
    }, secret, {
        expiresIn: "1d"
    })

    return {
        token,
        tokenExpiry
    };
}