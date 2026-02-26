import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    try {
        const result = await chatSession.sendMessage(prompt);
        const AIresp = result.response.text();

        return NextResponse.json({ result: AIresp });
    } catch (error) {
        const status = Number(error?.status) || 500;
        if (status === 429) {
            return NextResponse.json({
                result:
                    "I am currently running in fallback mode because Gemini quota is exhausted. You can still continue building and previewing files.",
                fallback: true,
            });
        }

        const message = error?.message || "Failed to generate AI response.";

        return NextResponse.json({ error: message }, { status });
    }
}
