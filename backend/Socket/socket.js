const express = require('express');
const {Server} = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server , {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let userSocketID = {}

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;
    console.log(userId , "Connected")

    userSocketID[userId] = socket.id;

    socket.on("message", (msg) => {
        const room = Array.from(socket.rooms)[1];
        socket.broadcast.to(room).emit("user-msg", {msg:msg , name:socket.username})
    })

    socket.on("joinRoom", ({name, room}) => {
        socket.join(room)
        socket.username = name
        socket.currentRoom = room;
        // console.log(socket.id , "Joined" , room)
        socket.broadcast.to(room).emit("Servermessage", `${name} Joined`)
        updateRoomCount(room);
    })

    socket.on("leaveRoom", ({name, room}) => {
        socket.leave(room)
        socket.broadcast.to(room).emit("Servermessage", `${name} left the room`)
        updateRoomCount(room);
    })

    function updateRoomCount(room) {
        const roomCount = io.sockets.adapter.rooms.get(room)?.size || 0;
        io.to(room).emit("roomCount", roomCount);
    }
})

module.exports = { io , userSocketID , app , server}