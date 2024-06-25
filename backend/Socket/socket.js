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

    io.emit("newUser", Object.keys(userSocketID))

    socket.on("message", (msg) => {
        const room = Array.from(socket.rooms)[1];
        socket.broadcast.to(room).emit("user-msg", {msg:msg , name:socket.username})
    })

    socket.on("disconnect",() => {
        delete userSocketID[userId];
        socket.broadcast.emit("newUser", Object.keys(userSocketID))
    })

})

module.exports = { io , userSocketID , app , server}