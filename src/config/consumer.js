import { consumer } from "./kafka.js";
import { prisma } from "../prisma/index.js";
import { getPollResults } from "../services/pollService.js";
import { getSocket } from "./socket.js";
export const consumeVotes = async () => {
  try {
    await consumer.connect();
    console.log("Kafka Consumer Connected!");

    await consumer.subscribe({ topic: "poll-votes", fromBeginning: true });
    console.log("Subscribed to topic: poll-votes");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { pollId, option } = JSON.parse(message.value.toString());
          console.log(`Received vote for Poll ${pollId}: Option ${option}`);

          // Store vote in database
          await prisma.vote.create({
            data: { pollId, option },
          });

          // Fetch updated poll results
          const pollResults = await getPollResults(pollId);

          // Emit update via WebSocket
          const io = getSocket();
          io.to(pollId).emit("pollUpdated", pollResults);

          console.log(`Vote processed for Poll ${pollId}:`, pollResults);
        } catch (error) {
          console.error("❌ Error processing vote:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error initializing Kafka consumer:", error);
  }
};
