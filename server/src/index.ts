import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./routes/expense";
import chatRouter from "./routes/AI/chat";
import googleRouter from "./routes/AI/google";
import savingsInsightsRouter from "./routes/AI/insights.route";

const app = express();
const port = 3333;
app.use(cors());
app.use(bodyParser.json());
app.use("/api/", savingsInsightsRouter);
app.use("/api/expenses", router);
app.use("/api/mistral", chatRouter);
app.use("/api/google", googleRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
