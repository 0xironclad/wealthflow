import express from "express";
import { chat } from "../../controllers/AI/Google";

const googleRouter = express.Router();
googleRouter.post("/", chat);
export default googleRouter;
