import express from "express";

import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import users from "../SocketIoTut/public/user.js";


const app = express();

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // your React dev server
        methods: ['GET', 'POST'],
    }
});



app.get('/', (req, res) => {
    // console.log("hello this is home page");
    res.json("hellow");

})
io.on('connection', (socket) => {
    console.log(`userId of connected user ${socket.id}`);

    socket.on("send_message", (data) => {
        const userExists = users.filter((e) => e._id === data.receiver._id);
        console.log("hello i am backend");
        if (userExists) {
            console.log("📨 Received:", data);
            io.emit("receive_message", data);
        }
        else {
            console.log("something went wrong");
        }

    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
})

server.listen(9099, () => {
    console.log("port is working on 9099")
})