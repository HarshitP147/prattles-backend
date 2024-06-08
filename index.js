import server, { connectDb, io } from "./server.js"

import configureSockets from "./socket.js"


const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    configureSockets(io);
    connectDb()
    console.log(`Server running http://localhost:8080/`)
})