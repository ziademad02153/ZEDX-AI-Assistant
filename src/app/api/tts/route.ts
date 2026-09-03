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

        // 1. Arabic -> ElevenLabs (Premium Natural Voice)
        if (language.startsWith('ar')) {
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

            const voiceId = "pNInz6obpgDQGcFmaJgB"; // Adam (Professional Male)
            const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

            let lastError = null;
            // Shuffle keys to distribute load evenly, but retry others if one is exhausted
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
                            model_id: 'eleven_multilingual_v2',
                            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                        }),
                    });

                    if (response.ok) {
                        return new NextResponse(response.body, {
                            headers: { 'Content-Type': 'audio/mpeg', 'Transfer-Encoding': 'chunked' },
                        });
                    }

                    // If failed (e.g., rate limit, out of quota), log and move to next key
                    lastError = await response.json().catch(() => null);
                    console.warn(`ElevenLabs Key failed (Status ${response.status}). Trying next key...`, lastError);
                } catch (e) {
                    lastError = e;
                    console.warn(`ElevenLabs fetch error. Trying next key...`, e);
                }
            }

            console.error("All ElevenLabs keys failed/exhausted:", lastError);
            return NextResponse.json({ error: 'Failed to generate audio from ElevenLabs (All keys exhausted)' }, { status: 500 });
        }

        // 2. Other Languages -> Microsoft Edge TTS (Free, Fast, High Quality)
        const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
        const voiceName = langConfig.voice || 'en-US-ChristopherNeural';

        const { EdgeTTS } = require('node-edge-tts');
        const tts = new EdgeTTS({ voice: voiceName, lang: language, outputFormat: 'audio-24khz-48kbitrate-mono-mp3' });
        
        const tempFilePath = path.join(os.tmpdir(), `tts-${crypto.randomUUID()}.mp3`);
        let audioBuffer: Buffer | null = null;
        
        try {
            // Write audio to temporary file
            await tts.ttsPromise(text, tempFilePath);
            audioBuffer = fs.readFileSync(tempFilePath);
        } catch (error: any) {
            console.error("EdgeTTS Error:", error);
            return NextResponse.json({ error: "Failed to generate audio from EdgeTTS", details: error.message }, { status: 500 });
        } finally {
            try {
                if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            } catch (e) {
                console.error("Failed to delete temp files:", e);
            }
        }

        if (!audioBuffer) {
            return NextResponse.json({ error: "No audio generated" }, { status: 500 });
        }

        return new NextResponse(audioBuffer as any, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
            },
        });

    } catch (error: any) {
        console.error('Error generating TTS:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error', stack: error.stack }, { status: 500 });
    }
}
