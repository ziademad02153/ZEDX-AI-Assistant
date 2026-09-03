import { NextResponse } from 'next/server';
import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';

export async function POST(req: Request) {
    try {
        const { text, language = 'en-US' } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Use ElevenLabs (Premium Natural Voice) for ALL languages
        // This avoids Vercel WebSocket timeouts and uses the 10 load-balanced keys
        const elevenLabsKeys = [
            process.env.ELEVENLABS_API_KEY,
            process.env.ELEVENLABS_API_KEY_1,
            process.env.ELEVENLABS_API_KEY_2,
            process.env.ELEVENLABS_API_KEY_3,
            process.env.ELEVENLABS_API_KEY_4,
            process.env.ELEVENLABS_API_KEY_5,
            process.env.ELEVENLABS_API_KEY_6,
            process.env.ELEVENLABS_API_KEY_7,
            process.env.ELEVENLABS_API_KEY_8,
            process.env.ELEVENLABS_API_KEY_9
        ].filter(Boolean) as string[];

        if (elevenLabsKeys.length === 0) {
            return NextResponse.json({ error: 'ELEVENLABS_API_KEY is missing' }, { status: 500 });
        }

        const voiceId = "pNInz6obpgDQGcFmaJgB"; // Adam (Professional Male - Multilingual)
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

        let lastError = null;
        const shuffledKeys = [...elevenLabsKeys].sort(() => Math.random() - 0.5);

        for (const apiKey of shuffledKeys) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': apiKey,
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: 'eleven_multilingual_v2', // Supports 29 languages perfectly
                        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                    }),
                });

                if (response.ok) {
                    return new NextResponse(response.body, {
                        headers: { 'Content-Type': 'audio/mpeg', 'Transfer-Encoding': 'chunked' },
                    });
                }

                lastError = await response.json().catch(() => null);
                console.warn(`ElevenLabs Key failed (Status ${response.status}). Trying next key...`, lastError);
            } catch (e) {
                lastError = e;
                console.warn(`ElevenLabs fetch error. Trying next key...`, e);
            }
        }

        console.error("All ElevenLabs keys failed/exhausted:", lastError);
        return NextResponse.json({ error: 'Failed to generate audio from ElevenLabs (All keys exhausted)' }, { status: 500 });

    } catch (error: any) {
        console.error('Error generating TTS:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error', stack: error.stack }, { status: 500 });
    }
}
