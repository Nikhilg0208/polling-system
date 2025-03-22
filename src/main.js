import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { Routes } from "./routes/index.js";
import { initSocket } from "./config/socket.js";
import { createServer } from "http";
import { producer } from "./config/kafka.js";
import { consumeVotes } from "./config/consumer.js";

dotenv.config();
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4000;
const MODE = process.env.MODE || "production";

initSocket(server);

if (MODE === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

Routes(app);

const startServer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer Connected!");

    await consumeVotes();

    server.listen(PORT, () => {
      console.log(`App is listening at ${PORT} in ${MODE} mode`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
