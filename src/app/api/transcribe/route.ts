import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as Blob;
        const apiKey = formData.get("apiKey") as string;

        if (!file || !apiKey) {
            return NextResponse.json({ error: "Missing file or API key" }, { status: 400 });
        }

        // Create a new FormData for Groq, excluding the apiKey field
        const groqFormData = new FormData();
        groqFormData.append("file", file);
        groqFormData.append("model", formData.get("model") || "whisper-large-v3");
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
            const errorText = await response.text();
            console.error("[Transcribe API] Groq Error:", errorText);
            return NextResponse.json({ error: `Groq Error: ${response.status} - ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ text: data.text });

    } catch (error: any) {
        console.error("[Transcribe API] Internal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
