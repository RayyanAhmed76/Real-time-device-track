const http = require("http");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 9000;

const app = express();

const server = http.createServer(app);
const socket = require("socket.io");

const io = socket(server);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    socket.emit("user-disconnected", socket.id);
  });
});

app.get("/", async (req, res) => {
  res.render("index");
});

server.listen(PORT);
