const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const messageRoute = require("./routes/messageRoute");
const { Server } = require("socket.io");
const subdomain = require("express-subdomain");
const User = require("./model/User");
const path = require("path");

const app = express();
require("dotenv").config({ path: path.join(__dirname, ".env") });

app.use(
    cors({
        origin: [
            "http://44.201.132.6",
            "https://chat-it-ai.netlify.app",
            "http://www.chat-it.tk",
            "https://www.chat-it.tk",
        ],
        credentials: true,
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hell!");
});
app.get("/test", (req, res) => {
    res.send("Hi");
});
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);
app.use(cookieParser());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((conn) => {
        console.log(`MONGO connected: ${conn.connection.host}`);
    });

const server = app.listen(process.env.PORT, () => {
    console.log(`Sever started on PORT ${process.env.PORT}`);
});

const io = new Server(server, {
    path: "/socket.io",
    cors: {
        origin: [
            "http://44.201.132.6",
            "https://chat-it-ai.netlify.app",
            "http://www.chat-it.tk",
            "https://www.chat-it.tk",
        ],
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});
