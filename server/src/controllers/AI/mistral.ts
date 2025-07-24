import { Mistral } from "@mistralai/mistralai";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
export const chat = async (req: Request, res: Response) => {
    const { prompt } = req.body;
    try {
        const apiKey = process.env.MISTRAL_API_KEY;
        const client = new Mistral({
            apiKey,
        });
        const completion = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: "You are an experienced programmer. You are have indepth knowledge of programming languages. Act as a helpful tutor." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        if (completion?.choices?.[0]?.message?.content !== undefined) {
            res.json({
                success: true,
                message: completion.choices[0].message.content
            });
        }
        else {
            res.json({
                success: false,
                message: "No response from the model"
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
