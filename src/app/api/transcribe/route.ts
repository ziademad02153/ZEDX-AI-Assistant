import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Missing file" }, { status: 400 });
        }

        // Define API keys FIRST
        const API_KEYS = [
            process.env.GROQ_STT_KEY_1,
            process.env.GROQ_STT_KEY_2,
            process.env.GROQ_STT_KEY_3,
            process.env.GROQ_STT_KEY_4,
            process.env.GROQ_STT_KEY_5,
        ].filter(Boolean) as string[];

        // Re-create the file to ensure integrity
        console.log(`[Transcribe API] Received file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

        if (file.size === 0) {
            return NextResponse.json({ error: "Received empty file" }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const fileBlob = new Blob([fileBuffer], { type: 'audio/webm' });

        if (API_KEYS.length === 0) {
            console.error("[Transcribe API] No keys found! Check .env.local");
            return NextResponse.json({ error: "Server configuration error: No keys available" }, { status: 500 });
        }

        // Shuffle keys once to start randomly but consistently
        const shuffledKeys = [...API_KEYS].sort(() => Math.random() - 0.5);

        let lastError = null;

        // TRY MULTIPLE KEYS AUTOMATICALLY (Robustness)
        for (const apiKey of shuffledKeys) {
            try {
                const maskedKey = apiKey.substring(0, 8) + '...';
                console.log(`[Transcribe API] Attempting with Key: ${maskedKey}`);

                const groqFormData = new FormData();
                // IMPORTANT: Must provide filename so Groq knows it's .webm
                groqFormData.append("file", fileBlob, "audio.webm");
                groqFormData.append("model", formData.get("model")?.toString() || "whisper-large-v3"); // Revert to stable model
                groqFormData.append("temperature", "0");

                if (formData.get("language")) {
                    groqFormData.append("language", formData.get("language") as string);
                }

                const userPrompt = formData.get("prompt")?.toString();
                if (userPrompt) {
                    groqFormData.append("prompt", userPrompt);
                }

                const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: groqFormData,
                });

                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json({ text: data.text });
                }

                // If not ok, capture error and try next key
                const errorBody = await response.text();
                lastError = { status: response.status, body: errorBody };
                console.warn(`[Transcribe API] Key ${maskedKey} failed (${response.status}). Body: ${errorBody.substring(0, 200)}`);

                // If it's a 413 (File too large) or 400 (Bad Request/Invalid File), don't retry.
                // Retrying a bad file with a different key won't fix it and just wastes limits.
                if (response.status === 413 || response.status === 400) {
                    console.warn(`[Transcribe API] Aborting retry for status ${response.status}`);
                    break;
                }

            } catch (err: unknown) {
                const error = err as Error;
                lastError = error;
                console.error(`[Transcribe API] Fetch failed for key. Trying next...`, error.message);
            }
        }

        // If we reach here, ALL keys failed
        return NextResponse.json({
            error: "All Groq keys failed or rate limited.",
            details: lastError
        }, { status: 503 });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("[Transcribe API] Internal Error:", err);
        const isDev = process.env.NODE_ENV === 'development';
        return NextResponse.json({
            error: isDev ? err.message : "An error occurred. Please try again."
        }, { status: 500 });
    }
}
