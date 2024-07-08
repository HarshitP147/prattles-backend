import server, { connectDb, io } from "./src/conf/server.js"

import configureSockets from "./src/conf/socket.js"


const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.clear()
    configureSockets(io);
    connectDb()
    console.log(`Server running http://localhost:8080/`)
})