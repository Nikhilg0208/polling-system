import { prisma } from "../prisma/index.js";
import { sendVote } from "../config/producer.js";

export const createPoll = async (data) => {
  try {
    let { question, options } = data;
    if (!question || typeof question !== "string" || !question.trim()) {
      throw new Error(
        "Poll question is required and must be a non-empty string."
      );
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      throw new Error("Poll must have at least two valid options.");
    }

    options = [...new Set(options.map((opt) => opt.trim()))];

    if (options.length < 2) {
      throw new Error(
        "Poll options must be unique and contain at least two valid choices."
      );
    }

    const poll = await prisma.poll.create({
      data: { question: question.trim(), options },
    });

    return poll;
  } catch (error) {
    console.error("Error creating poll:", error);
    return Promise.reject(new Error("Internal Server Error"));
  }
};

export const votePoll = async (pollId, option) => {
  try {
    if (!pollId || typeof pollId !== "string")
      throw new Error("Invalid poll ID.");

    if (typeof option !== "number") throw new Error("Option must be a number.");

    const poll = await prisma.poll.findUnique({ where: { id: pollId } });

    if (!poll) throw new Error("Poll not found.");

    await sendVote(pollId, option);

    return { success: true, message: "Vote submitted successfully!" };
  } catch (error) {
    console.error("Error in votePoll:", error);
    return Promise.reject(new Error("Internal Server Error"));
  }
};

export const getPollResults = async (pollId) => {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { votes: true },
    });

    if (!poll || poll.votes.length === 0) {
      throw new Error("Poll not found or no votes exist.");
    }

    // Count votes per option
    const results = poll.options.map((option) => ({
      option,
      votes: poll.votes.filter((vote) => vote.option === option).length,
    }));

    return {
      pollId,
      question: poll.question,
      results,
    };
  } catch (error) {
    console.error("Error in getPollResults service:", error);
    return Promise.reject(new Error("Internal Server Error"));
  }
};
