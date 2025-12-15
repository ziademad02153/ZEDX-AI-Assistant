import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as Blob;

        if (!file) {
            return NextResponse.json({ error: "Missing file" }, { status: 400 });
        }

        // Use server-side API key instead of client-provided one (more secure)
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Create a new FormData for Groq
        const groqFormData = new FormData();
        groqFormData.append("file", file);
        groqFormData.append("model", formData.get("model")?.toString() || "whisper-large-v3");
        if (formData.get("language")) {
            groqFormData.append("language", formData.get("language") as string);
        }

        // Groq API Endpoint for Whisper
        const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            },
            body: groqFormData,
        });

        if (!response.ok) {
            console.error("[Transcribe API] Groq Error:", response.status);
            const isDev = process.env.NODE_ENV === 'development';
            return NextResponse.json({
                error: isDev ? `Groq Error: ${response.status}` : "Transcription failed. Please try again."
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ text: data.text });

    } catch (error: any) {
        console.error("[Transcribe API] Internal Error:", error);
        const isDev = process.env.NODE_ENV === 'development';
        return NextResponse.json({
            error: isDev ? error.message : "An error occurred. Please try again."
        }, { status: 500 });
    }
}
