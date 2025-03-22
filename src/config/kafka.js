import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

export const kafka = new Kafka({
  clientId: "polling-app",
  brokers: process.env.KAFKA_BROKER.split(","),
});

async function init() {
  try {
    const admin = kafka.admin();
    await admin.connect();
    console.log("Kafka Admin Connected!");
    const topics = await admin.listTopics();

    if (!topics.includes("poll-votes")) {
      await admin.createTopics({
        topics: [
          { topic: "poll-votes", numPartitions: 1, replicationFactor: 1 },
        ],
      });
      console.log("Kafka Topics Created Successfully!");
    } else {
      console.log("Topic 'poll-votes' already exists. Skipping creation.");
    }
    console.log("Kafka Topics Created Successfully!");
    await admin.disconnect();
  } catch (error) {
    console.error("Error setting up Kafka:", error);
  }
}

init();

export const producer = kafka.producer();

export const consumer = kafka.consumer({
  groupId: "polling-group",
});
