const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDb = require("./config/db");
const { port, frontendUrl } = require("./config/env");

const bootstrap = async () => {
  await connectDb();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: frontendUrl,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join:conversation", ({ conversationId }) => socket.join(`conv:${conversationId}`));
    socket.on("message:send", ({ conversationId, message }) => io.to(`conv:${conversationId}`).emit("message:receive", message));
    socket.on("user:typing", ({ conversationId, userId }) => socket.to(`conv:${conversationId}`).emit("user:typing", { userId }));
  });

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`MedAssist API running on ${port}`);
  });
};

bootstrap();
