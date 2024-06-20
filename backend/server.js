const express = require("express")
const cors = require("cors")
const {app , server} = require("./Socket/socket")
const path = require("path")
const { connectToDb, isConnected } = require("./db")
const AuthRouter = require("./Routes/AuthRoutes")
const MessagesRouter = require("./Routes/MessagesRoutes")
const ConversationRouter = require("./Routes/ConversationRouter")
const cookieParser = require("cookie-parser")

connectToDb()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(AuthRouter)
app.use(MessagesRouter)
app.use(ConversationRouter)

// const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, "../client/dist")))
app.get("*" , (req, res) => {
    res.sendFile(path.join(__dirname, "..client/dist/index.html"))
})

const port = 3000

app.get("/", (req, res) => {
    res.send("Home Route")
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
