import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { provider, apiKey, model, messages, systemPrompt } = body;

        if (!apiKey) {
            return NextResponse.json({ error: { message: "Missing API Key" } }, { status: 400 });
        }

        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) console.log(`[API Generate] Provider: ${provider}, Model: ${model}`);

        // --- Google Gemini Logic (Using Direct REST API to avoid SDK version issues) ---
        if (provider === "google") {
            const candidateModels = [
                model, // User's manual selection
                "gemini-2.5-flash-lite", // LITE: May have separate quota!
                "gemini-2.0-flash-lite", // LITE: May have separate quota!
                "gemini-2.5-flash",
                "gemini-2.5-pro",
                "gemini-flash-latest",
                "gemini-2.0-flash",
                "gemini-2.0-flash-001",
                "gemini-2.0-flash-exp",
                "gemini-exp-1206",
            ].filter(Boolean);

            const uniqueModels = [...new Set(candidateModels)];
            let lastError: any = null;

            // Construct Prompt for Gemini
            // If messages are provided (chat format), convert to Gemini 'contents' format
            // If prompt is provided (legacy), use it directly
            let geminiBody: any = {};

            if (messages) {
                // Convert OpenAI messages to Gemini
                const contents = messages.map((m: any) => ({
                    role: m.role === "assistant" ? "model" : "user",
                    parts: [{ text: m.content }]
                }));
                // Inject System Instruction if available (Gemini API supports system_instruction)
                if (systemPrompt) {
                    geminiBody.system_instruction = { parts: [{ text: systemPrompt }] };
                }
                geminiBody.contents = contents;
            } else {
                // Legacy Prompt mode
                geminiBody = {
                    contents: [{
                        role: "user",
                        parts: [{ text: body.prompt }]
                    }]
                };
            }

            // Try models sequentially via FETCH
            for (const targetModel of uniqueModels) {
                try {
                    if (isDev) console.log(`[API Generate] Trying ${targetModel}...`);
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(geminiBody)
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        // Throw error to trigger catch block and retry next model
                        throw new Error(data.error?.message || `HTTP ${response.status}: ${data.error?.status || "Unknown Error"}`);
                    }

                    // Extract text
                    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (!content) throw new Error("Empty response content from Google");

                    if (isDev) console.log(`[API Generate] Success: ${targetModel}`);
                    return NextResponse.json({ content, modelUsed: targetModel });

                } catch (error: any) {
                    console.warn(`[API Generate] Failed with ${targetModel}:`, error.message);
                    lastError = error;
                    if (error.message.includes("API_KEY_INVALID") || error.message.includes("key expired")) {
                        return NextResponse.json({ error: { message: "API Key Invalid or Expired" } }, { status: 401 });
                    }
                }
            }

            return NextResponse.json({
                error: {
                    message: `All Gemini models failed (REST). Last error: ${lastError?.message || "Unknown Error"}. Please check your API Key.`
                }
            }, { status: 500 });
        }

        // --- OpenAI / OpenRouter / Grok Logic (Unchanged) ---
        let baseUrl = "https://api.openai.com/v1";
        let targetModel = model || "gpt-3.5-turbo";

        if (provider === "grok") {
            baseUrl = "https://api.x.ai/v1";
            targetModel = model || "grok-beta";
        } else if (provider === "openrouter") {
            baseUrl = "https://openrouter.ai/api/v1";
            targetModel = model || "google/gemini-2.0-flash-exp:free"; // Updated default
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

        if (provider === "openrouter") {
            fetchOptions.headers["HTTP-Referer"] = "https://zedx-ai.com";
            fetchOptions.headers["X-Title"] = "ZEDX-AI";
        }

        const response = await fetch(`${baseUrl}/chat/completions`, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
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
