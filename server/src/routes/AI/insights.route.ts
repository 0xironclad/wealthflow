import express from "express";
import { getInsightsSavings } from "../../controllers/AI/insights.controller";

const savingsInsightsRouter = express.Router();

savingsInsightsRouter.post("/getInsightsSavings", getInsightsSavings);

export default savingsInsightsRouter;
