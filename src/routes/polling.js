import express from "express";
import {
  createVote,
  getPollResult,
  pollCreatation,
} from "../controllers/polling.js";
const pollRouter = express.Router();
pollRouter.post("/", pollCreatation);
pollRouter.post("/:pollId/vote", createVote);
pollRouter.get("/:pollId", getPollResult);
export { pollRouter };
