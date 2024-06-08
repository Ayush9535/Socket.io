const express = require("express")
const cors = require("cors")
const {Server} = require("socket.io") 
const http = require("http")

const app = express()
const server = http.createServer(app)
const io = new Server(server , {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const port = 3000

io.on("connection", (socket) => {
    socket.on("message", (msg) => {
        const room = Array.from(socket.rooms)[1];
        console.log(msg , socket.id , Array.from(socket.rooms))
        socket.broadcast.to(room).emit("user-msg", {msg:msg , name:socket.username})
    })

    socket.on("joinRoom", ({name, room}) => {
        socket.join(room)
        socket.username = name
        console.log(socket.id , "Joined" , room)
        socket.broadcast.to(room).emit("Servermessage", `${name} Joined`)
        updateRoomCount(room);
    })

    socket.on("disconnect", () => {
        const room = Array.from(socket.rooms)[1];
        socket.broadcast.to(room).emit("Servermessage", `${socket.username} left the room`);
        updateRoomCount(room);
    });

    function updateRoomCount(room) {
        const roomCount = io.sockets.adapter.rooms.get(room)?.size || 0;
        io.to(room).emit("roomCount", roomCount);
    }
})



app.get("/", (req, res) => {
    res.send("Home Route")
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})