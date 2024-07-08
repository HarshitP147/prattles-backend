import { createServer } from 'node:http';

import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv'
import cors from 'cors'
import { connect } from 'mongoose'
import { Server } from 'socket.io'
import helmet from 'helmet';

import authRoute from '../routes/auth.routes.js';
import userRoute from '../routes/user.routes.js';

const { json, raw, urlencoded } = bodyParser;
config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        allowedHeaders: '*',
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        preflightContinue: true
    },
})

app.use(json());
app.use(urlencoded({
    extended: true,
}))
app.use(raw())
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: true
}));

app.get('/', (_, res) => {
    res.json({
        "message": "Hello world",
        "database": "Mongodb database instance connected",
        "auth": "Added google OAuth2.0",
        "socket": "Added socket instance for communication"
    })
})

app.use("/auth", authRoute);
app.use("/user", userRoute);

export async function connectDb() {
    connect(process.env.MONGODB_URI, {
        auth: {
            username: process.env.MONGODB_USERNAME,
            password: process.env.MONGODB_PASSWORD
        },
        dbName: 'webChatApp'
    })
        .then(() => {
            console.log('Connection successful');
        })
        .catch((err) => {
            console.error(err);
        })
}

export { io }
export default server;