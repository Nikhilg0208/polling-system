import { producer } from "./kafka.js";
export const sendVote = async (pollId, option) => {
  try {
    await producer.send({
      topic: "poll-votes",
      messages: [{ value: JSON.stringify({ pollId, option }) }],
    });
    console.log(`Vote sent for Poll ${pollId}: Option ${option}`);
  } catch (error) {
    console.error("Error sending vote to Kafka:", error);
    throw new Error("Failed to send vote");
  }
};
