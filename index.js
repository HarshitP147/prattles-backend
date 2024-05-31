import { createServer } from 'node:http';

import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv'
import { connect } from 'mongoose'

import authRoute from './routes/auth.js';

const { json, raw, urlencoded } = bodyParser;
config();

const PORT = process.env.PORT || 8080

const app = express();
const server = createServer(app);

app.use(json());
app.use(urlencoded({
    extended: true,
}))
app.use(raw())

app.get('/', (req, res) => {
    res.json({
        "message": "Hello world",
        "database": "Mongodb database instance connected",
        "auth": "Added google OAuth2.0"
    })
})

app.use("/auth", authRoute);


async function connectDb() {
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


server.listen(PORT, () => {
    connectDb()
    console.log(`Server running http://localhost:8080/`)
})