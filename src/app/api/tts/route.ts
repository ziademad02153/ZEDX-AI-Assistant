import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'ELEVENLABS_API_KEY is missing' }, { status: 500 });
        }

        // Using Adam's voice ID (professional male), model: eleven_multilingual_v2
        const voiceId = "pNInz6obpgDQGcFmaJgB";
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("ElevenLabs Error:", errorData);
            return NextResponse.json(
                { error: 'Failed to generate audio from ElevenLabs' },
                { status: response.status }
            );
        }

        // Return the audio stream directly to the client
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error) {
        console.error('Error generating TTS:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
