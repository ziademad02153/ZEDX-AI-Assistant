import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { provider, apiKey, model } = body;

        if (!provider || !apiKey) {
            return NextResponse.json(
                { error: { message: "Missing provider or API key" } },
                { status: 400 }
            );
        }

        let baseUrl = "https://api.openai.com/v1";
        let targetModel = model || "gpt-3.5-turbo";

        // Determine Base URL based on provider
        if (provider === "grok") {
            baseUrl = "https://api.x.ai/v1";
            targetModel = model || "grok-beta";
        } else if (provider === "openrouter") {
            baseUrl = "https://openrouter.ai/api/v1";
            targetModel = model || "meta-llama/llama-3-8b-instruct:free";
        } else if (provider === "google") {
            // Google Gemini often uses a different client library, but for REST compatibility:
            // Note: The frontend was using the Google Generative AI SDK for 'google' provider.
            // If we want to proxy that too, we'd need the SDK here. 
            // However, the frontend logic separated Google (SDK) from others (REST).
            // We will ONLY handle REST providers here for now, or handle Google if passed.
            // If the frontend handles Google separately via SDK, we should keep that there or move it here.
            // Looking at the frontend code, Google was handled via `google-generative-ai` package.
            // For consistency, let's keep Google on the client for now if it works, OR move it here.
            // BUT, the user's issue is with OpenRouter. Let's focus on REST providers.
            return NextResponse.json(
                { error: { message: "Google provider should be handled via SDK on client or specific route" } },
                { status: 400 }
            );
        }

        console.log(`[API Proxy] Testing connection to ${provider} (${baseUrl})`);
        console.log(`[API Proxy] API Key Length: ${apiKey ? apiKey.length : 'undefined'}`);

        console.log(`[API Proxy] Sending request to ${baseUrl}/chat/completions`);

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
                model: targetModel,
                messages: [{ role: "user", content: "Hello, are you online?" }],
                max_tokens: 10
            })
        });

        console.log(`[API Proxy] Upstream Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[API Proxy] Upstream Error Body:`, errorText);
            try {
                const errorJson = JSON.parse(errorText);
                return NextResponse.json(errorJson, { status: response.status });
            } catch {
                return NextResponse.json(
                    { error: { message: `Upstream API Error: ${response.status} - ${errorText}` } },
                    { status: response.status }
                );
            }
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("[API Proxy] Internal Error:", error);
        return NextResponse.json(
            { error: { message: error.message || "Internal Server Error" } },
            { status: 500 }
        );
    }
}
