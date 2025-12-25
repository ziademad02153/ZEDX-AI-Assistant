import { NextRequest } from "next/server";

// Streaming AI Generation using Groq
// This endpoint returns Server-Sent Events (SSE) for real-time word-by-word responses

export const runtime = "edge"; // Use Edge Runtime for faster streaming

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { model, messages, systemPrompt } = body;

        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            return new Response(
                JSON.stringify({ error: "Server AI configuration missing" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Build messages array with system prompt
        const finalMessages = systemPrompt
            ? [{ role: "system", content: systemPrompt }, ...messages]
            : messages;

        // Request streaming response from Groq
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: model || "llama-3.1-8b-instant",
                messages: finalMessages,
                max_tokens: 1024,
                temperature: 0.7,
                stream: true // Enable streaming
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("[Stream API] Groq Error:", errorData);
            return new Response(
                JSON.stringify({ error: "AI temporarily unavailable" }),
                { status: response.status, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create a TransformStream to process the SSE data
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const transformStream = new TransformStream({
            async transform(chunk, controller) {
                const text = decoder.decode(chunk);
                const lines = text.split("\n").filter(line => line.trim() !== "");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                            return;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                // Send each token as SSE
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                            }
                        } catch {
                            // Ignore parse errors for incomplete chunks
                        }
                    }
                }
            }
        });

        // Pipe the response through our transform
        const stream = response.body?.pipeThrough(transformStream);

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        });

    } catch (error: unknown) {
        console.error("[Stream API] Error:", error);
        return new Response(
            JSON.stringify({ error: (error as Error).message || "Stream failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
