import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { provider, apiKey, model, messages, systemPrompt } = body;

        if (!apiKey) {
            return NextResponse.json({ error: { message: "Missing API Key" } }, { status: 400 });
        }

        console.log(`[API Generate] Provider: ${provider}, Model: ${model}`);

        // --- Google Gemini Logic ---
        if (provider === "google") {
            const genAI = new GoogleGenerativeAI(apiKey);
            const targetModel = model || "gemini-1.5-flash";
            const geminiModel = genAI.getGenerativeModel({ model: targetModel });

            // Convert standard messages to Gemini format if needed, 
            // but for this app we mostly send a constructed prompt.
            // If 'messages' is passed, we might need to format it.
            // However, the frontend currently constructs a big 'prompt' string for Google.
            // Let's support both 'prompt' (raw text) and 'messages'.

            let finalPrompt = body.prompt;
            if (!finalPrompt && messages) {
                // Simple conversion for now: System + User
                finalPrompt = `${systemPrompt}\n\n${messages[messages.length - 1].content}`;
            }

            try {
                const result = await geminiModel.generateContent(finalPrompt);
                const response = await result.response;
                const text = response.text();
                return NextResponse.json({ content: text });
            } catch (error: any) {
                console.error("[API Generate] Google Error:", error);
                return NextResponse.json({ error: { message: error.message || "Google AI Error" } }, { status: 500 });
            }
        }

        // --- OpenAI / OpenRouter / Grok Logic ---
        let baseUrl = "https://api.openai.com/v1";
        let targetModel = model || "gpt-3.5-turbo";

        if (provider === "grok") {
            baseUrl = "https://api.x.ai/v1";
            targetModel = model || "grok-beta";
        } else if (provider === "openrouter") {
            baseUrl = "https://openrouter.ai/api/v1";
            targetModel = model || "meta-llama/llama-3-8b-instruct:free";
        }

        const fetchOptions: any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
                model: targetModel,
                messages: messages || [{ role: "user", content: body.prompt }],
                max_tokens: 500,
                temperature: 0.7
            })
        };

        // Add OpenRouter specific headers
        if (provider === "openrouter") {
            fetchOptions.headers["HTTP-Referer"] = "https://zedx-ai.com";
            fetchOptions.headers["X-Title"] = "ZEDX-AI";
        }

        const response = await fetch(`${baseUrl}/chat/completions`, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Generate] Upstream Error (${provider}):`, errorText);
            try {
                const errorJson = JSON.parse(errorText);
                return NextResponse.json(errorJson, { status: response.status });
            } catch {
                return NextResponse.json({ error: { message: errorText } }, { status: response.status });
            }
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        return NextResponse.json({ content });

    } catch (error: any) {
        console.error("[API Generate] Internal Error:", error);
        return NextResponse.json(
            { error: { message: error.message || "Internal Server Error" } },
            { status: 500 }
        );
    }
}
