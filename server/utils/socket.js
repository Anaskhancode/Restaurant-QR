import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (userId) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export const sendOrderUpdate = (userId, orderId, orderStatus) => {
    console.log("Sending update to:", userId, orderStatus); // 👈 DEBUG
  if (io) {
    io.to(userId).emit("order-status-update", {
      orderId,
      orderStatus
    });
  }
};
