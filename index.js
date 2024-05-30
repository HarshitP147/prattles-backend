import { createServer } from 'node:http';

import  express from 'express';
import bodyParser from 'body-parser';

const { json, raw, urlencoded } = bodyParser;

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
        "message": "Hello world"
    })
})


app.use("/*", (_, res) => {
    res.redirect("/");
})

server.listen(PORT,() => {
    console.log(`Server running http://localhost:8080/`)
})