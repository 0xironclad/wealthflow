import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
export const chat = async (req: Request, res: Response) => {
    const { prompt } = req.body;
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("GOOGLE_API_KEY is not configured");
        }
        const generativeAI = new GoogleGenerativeAI(apiKey);
        const model = generativeAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response =  result.response;
        const text = response.text();
        res.json({
            success: true,
            message: text
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
