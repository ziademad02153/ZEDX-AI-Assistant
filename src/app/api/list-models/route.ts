import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey) {
            return NextResponse.json({ error: { message: "Missing API Key" } }, { status: 400 });
        }

        // Fetch models from Google API directly
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to fetch models: ${response.status} ${text}`);
        }

        const data = await response.json();

        // Filter for "generateContent" supported models
        const models = (data.models || [])
            .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
            .map((m: any) => m.name.replace("models/", "")); // Remove 'models/' prefix

        return NextResponse.json({ models });

    } catch (error: any) {
        console.error("[List Models] Error:", error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}
