'use server';

// app/api/chatbot/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, conversationHistory } = body;

        if (typeof message !== "string") {
            return NextResponse.json({ error: "Invalid message" }, { status: 400 });
        }

        if (!Array.isArray(conversationHistory)) {
            return NextResponse.json({ error: "Invalid history" }, { status: 400 });
        }

        // Build valid messages array
        const messages = [
            {
                role: "system",
                content: `
            You are a knowledgeable and helpful assistant for Lolo Boyong’s Kantina.

            Business details:
            - Founded in 2019 by Mr. Richmond Bonza and Mrs. Joan Bonza
            - Address: Poblacion 3, Mabini St., Sta. Cruz, Laguna
            - Operating hours: Monday to Sunday, 10:00 AM – 8:00 PM
            - Contact number: 0939-829-2110
            - Email: loloboyong01@gmail.com

            Instructions:
            - Answer questions strictly based on the information provided.
            - If a question is outside the scope of this information, respond politely and state that the information is not available.
            - Match the language used by the customer:
            - If the user writes in Tagalog, respond in Tagalog.
            - If the user writes in English, respond in English.
            - Maintain a professional, friendly, and concise tone at all times.

        `.trim(),
            },
            // Append conversation history from front end
            ...conversationHistory.map((m: any) => ({
                role: m.role,
                content: m.content,
            })),
            {
                role: "user",
                content: message,
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = response.choices?.[0]?.message?.content || "";

        return NextResponse.json({ reply });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Server error" },
            { status: 500 }
        );
    }
}
