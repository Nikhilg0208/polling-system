import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("joinPoll", (pollId) => {
      try {
        socket.join(pollId);
        console.log(`Client ${socket.id} joined poll room: ${pollId}`);
      } catch (error) {
        console.error("Error joining poll:", error);
      }
    });

    socket.on("disconnect", () => {
      try {
        console.log(`Client disconnected: ${socket.id}`);
        socket.disconnect();
      } catch (error) {
        console.error("Error on disconnect:", error);
      }
    });
  });
};

export const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io not initialized.");
  }
  return io;
};
