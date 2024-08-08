import server, { connectDb, io } from "./src/server/main.js"

import configureSockets from "./src/server/socket.js"


const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.clear()
    configureSockets(io);
    connectDb()
    console.log(`Server running on port:${process.env.PORT}`)
})