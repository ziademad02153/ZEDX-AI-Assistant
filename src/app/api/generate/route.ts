import { NextResponse } from "next/server";

// Groq Models Fallback Chain
const GROQ_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "qwen/qwen3-32b",
    "openai/gpt-oss-120b"
];

// Debug GET handler to verify endpoint reaches the server
export async function GET() {
    return NextResponse.json({ status: "ok", message: "AI Generate endpoint is active" });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { model, messages, systemPrompt, prompt } = body;

        const isDev = process.env.NODE_ENV === 'development';

        // Get Groq API Key from server environment
        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            return NextResponse.json(
                { error: { message: "Server AI configuration missing. Please contact support." } },
                { status: 500 }
            );
        }

        if (isDev) console.log(`[API Generate] Using Groq with model: ${model || 'auto'}`);

        // Build model fallback chain - user's selection first, then fallbacks
        const modelsToTry = model ? [model, ...GROQ_MODELS.filter(m => m !== model)] : GROQ_MODELS;
        const uniqueModels = [...new Set(modelsToTry)];

        let lastError: Error | null = null;

        for (const targetModel of uniqueModels) {
            try {
                if (isDev) console.log(`[API Generate] Trying Groq ${targetModel}...`);

                // Build messages array
                const groqMessages = messages || [{ role: "user", content: prompt }];

                // Add system prompt if provided
                const finalMessages = systemPrompt
                    ? [{ role: "system", content: systemPrompt }, ...groqMessages]
                    : groqMessages;

                // Add timeout of 30 seconds
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${groqApiKey}`
                    },
                    body: JSON.stringify({
                        model: targetModel,
                        messages: finalMessages,
                        max_tokens: 1024,
                        temperature: 0.7
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error?.message || `HTTP ${response.status}`);
                }

                const content = data.choices?.[0]?.message?.content;
                if (!content) throw new Error("Empty response from AI");

                if (isDev) console.log(`[API Generate] Groq Success: ${targetModel}`);
                return NextResponse.json({
                    content,
                    modelUsed: targetModel,
                    provider: "groq"
                });

            } catch (error: unknown) {
                const err = error as Error;
                console.warn(`[API Generate] Groq ${targetModel} failed:`, err.message);
                lastError = err;

                // If rate limited or quota exceeded, try next model
                if (err.message.includes("429") || err.message.includes("quota")) {
                    continue;
                }
            }
        }

        // All models failed
        return NextResponse.json({
            error: {
                message: isDev
                    ? `AI temporarily unavailable. ${lastError?.message || "Please try again."}`
                    : "AI temporarily unavailable. Please try again later."
            }
        }, { status: 503 });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("[API Generate] Internal Error:", err);
        const isDevEnv = process.env.NODE_ENV === 'development';
        return NextResponse.json(
            { error: { message: isDevEnv ? err.message : "An error occurred. Please try again." } },
            { status: 500 }
        );
    }
}
