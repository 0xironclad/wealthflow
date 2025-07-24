import Express from "express";
import { chat } from "../../controllers/AI/mistral";

const chatRouter = Express.Router();
chatRouter.post("/", chat);
export default chatRouter;
