import server,{ connectDb } from "./server.js"

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    connectDb()
    console.log(`Server running http://localhost:8080/`)
})