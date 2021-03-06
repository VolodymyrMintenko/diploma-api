const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const authRoute = require("./routes/auth");
const campaignsRoute = require("./routes/campaigns");
const usersRoute = require("./routes/users");

dotenv.config({
  path: path.join(__dirname, `.env`),
});
// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  createServer
);
function createServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  // Route Middlewares
  app.use("/auth", authRoute);
  app.use("/campaigns", campaignsRoute);
  app.use("/users", usersRoute);
  app.use("/articles", require("./routes/api/articles"));
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Serving on http://localhost:${port}`));

  let broadcaster;

  const http = require("http");
  const server = http.createServer(app);

  const io = require("socket.io")(server);
  app.use(express.static(__dirname + "/public"));

  io.sockets.on("error", (e) => console.log(e));
  io.sockets.on("connection", (socket) => {
    socket.on("broadcaster", () => {
      broadcaster = socket.id;
      socket.broadcast.emit("broadcaster");
    });
    socket.on("watcher", () => {
      socket.to(broadcaster).emit("watcher", socket.id);
    });
    socket.on("offer", (id, message) => {
      socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
      socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
      socket.to(id).emit("candidate", socket.id, message);
    });
    socket.on("disconnect", () => {
      socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
  });
}
