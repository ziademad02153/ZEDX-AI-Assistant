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

        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) console.log(`[Test Connection] Provider: ${provider}`);

        // --- Google Gemini Logic (REST API + Robust Fallback + Auto-Discovery) ---
        if (provider === "google") {
            const candidateModels = [
                model,
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

            let errorLog = "";
            let lastError: any = null;

            // 1. Try Generation with Fallback List
            for (const m of uniqueModels) {
                try {
                    if (isDev) console.log(`[Test Connection] Trying ${m}...`);
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey.trim()}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ contents: [{ parts: [{ text: "Test." }] }] })
                    });

                    if (response.ok) {
                        return NextResponse.json({ success: true, message: `Connected to Google Gemini (${m}) successfully.` });
                    } else {
                        const errorData = await response.json();
                        const msg = errorData.error?.message || response.statusText;
                        errorLog += `[${m}]: ${msg}\n`;
                    }
                } catch (e: any) {
                    errorLog += `[${m}]: Network Error - ${e.message}\n`;
                }
            } // End for loop

            // 2. Auto-Discovery: If all failed, WHAT models DO exist for this key?
            let availableModelsLog = "";
            try {
                if (isDev) console.log("[Test Connection] Auto-Discovery...");
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
                if (listRes.ok) {
                    const listData = await listRes.json();
                    const validModels = (listData.models || [])
                        .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
                        .map((m: any) => m.name.replace("models/", ""));

                    if (validModels.length > 0) {
                        availableModelsLog = `\n[Auto-Discovery]: Your key IS VALID for these models: ${validModels.join(", ")}. Please select one of these manually in Settings.`;
                    } else {
                        availableModelsLog = "\n[Auto-Discovery]: Your key is valid but Google returned 0 models supporting 'generateContent'.";
                    }
                } else {
                    availableModelsLog = `\n[Auto-Discovery Failed]: ListModels endpoint returned ${listRes.status}. Your key may be blocked or invalid.`;
                }
            } catch (e) {
                availableModelsLog = "\n[Auto-Discovery Failed]: Network Error during ListModels.";
            }

            return NextResponse.json({
                error: { message: `Connection Failed. ${availableModelsLog}\n\nDetailed Errors:\n${errorLog}` }
            }, { status: 500 });
        } // End if google

        // --- OpenRouter Logic (User's Model Only) ---
        if (provider === "openrouter") {
            const targetModel = model || "google/gemini-2.0-flash-exp:free";

            if (!model) {
                return NextResponse.json({
                    error: { message: "Please select a model from the dropdown or type a valid Model ID." }
                }, { status: 400 });
            }

            if (isDev) console.log(`[Test Connection] OpenRouter model: ${targetModel}`);

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey.trim()}`,
                    "HTTP-Referer": "https://zedx-ai.com",
                    "X-Title": "ZEDX-AI"
                },
                body: JSON.stringify({
                    model: targetModel,
                    messages: [{ role: "user", content: "Test." }],
                    max_tokens: 5
                })
            });

            if (response.ok) {
                return NextResponse.json({ success: true, message: `Connected to OpenRouter (${targetModel}) successfully!` });
            } else {
                const errorData = await response.json();
                return NextResponse.json({
                    error: { message: `Model "${targetModel}" failed: ${errorData.error?.message || response.statusText}` }
                }, { status: response.status });
            }
        }

        // --- OpenAI / Grok Logic (REST) ---
        let baseUrl = "https://api.openai.com/v1";
        let targetModel = model || "gpt-3.5-turbo";

        if (provider === "grok") {
            baseUrl = "https://api.x.ai/v1";
            targetModel = model || "grok-beta";
        }

        const fetchOptions: any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
                model: targetModel,
                messages: [{ role: "user", content: "Test connection." }],
                max_tokens: 5
            })
        };

        const response = await fetch(`${baseUrl}/chat/completions`, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                return NextResponse.json({ error: errorJson.error || { message: errorText } }, { status: response.status });
            } catch {
                return NextResponse.json({ error: { message: errorText } }, { status: response.status });
            }
        }

        return NextResponse.json({ success: true, message: `Connected to ${provider} successfully.` });

    } catch (error: any) {
        console.error("[Test Connection] Internal Error:", error);
        return NextResponse.json(
            { error: { message: error.message || "Internal Server Error" } },
            { status: 500 }
        );
    }
}
