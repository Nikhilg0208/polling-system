import {
  createPoll,
  votePoll,
  getPollResults,
} from "../services/pollService.js";
export const pollCreatation = async (req, res) => {
  try {
    const poll = await createPoll(req.body);
    return res.status(201).json({
      success: true,
      message: "Poll created successfully!",
      data: poll,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create poll.",
    });
  }
};

export const createVote = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { option } = req.body;

    if (!pollId || !option) {
      return res.status(400).json({
        success: false,
        message: "Poll ID and option are required.",
      });
    }

    const vote = await votePoll(pollId, option);

    return res.status(200).json({
      success: true,
      message: "Vote submitted successfully!",
      data: vote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "ailed to process vote.",
    });
  }
};

export const getPollResult = async (req, res) => {
  try {
    const { pollId } = req.params;

    if (!pollId) {
      return res.status(400).json({
        success: false,
        message: "Poll ID is required.",
      });
    }

    const results = await getPollResults(pollId);

    if (!results) {
      return res.status(404).json({
        success: false,
        message: "Poll not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Poll results retrieved successfully!",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching poll results:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get poll results.",
    });
  }
};
