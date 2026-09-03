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
            const elevenLabsKeys = Object.keys(process.env)
                .filter(key => key.startsWith('ELEVENLABS_API_KEY'))
                .map(key => process.env[key])
                .filter(Boolean) as string[];

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

        // We must generate a unique file path to prevent concurrent request clashes
        const tempFilePath = path.join(os.tmpdir(), `tts-${crypto.randomUUID()}.mp3`);
        const scriptPath = path.join(os.tmpdir(), `tts-script-${crypto.randomUUID()}.js`);
        
        // WORKAROUND: node-edge-tts hangs inside Next.js API routes due to stream/ws handling.
        // We spawn a separate Node process to handle the generation safely.
        const base64Text = Buffer.from(text).toString('base64');
        const nodeModulesPath = path.join(process.cwd(), 'node_modules', 'node-edge-tts');
        const script = `
const { EdgeTTS } = require('${nodeModulesPath.replace(/\\/g, '\\\\')}');
const tts = new EdgeTTS({ voice: '${voiceName}', lang: '${language}', outputFormat: 'audio-24khz-48kbitrate-mono-mp3' });
tts.ttsPromise(Buffer.from('${base64Text}', 'base64').toString('utf-8'), '${tempFilePath.replace(/\\/g, '\\\\')}')
    .then(() => process.exit(0))
    .catch(e => { console.error(e); process.exit(1); });
`;
        
        let audioBuffer: Buffer | null = null;
        try {
            fs.writeFileSync(scriptPath, script);
            
            const { exec } = require('child_process');
            const util = require('util');
            const execAsync = util.promisify(exec);
            
            // Added timeout to prevent hanging forever
            await execAsync(`node "${scriptPath}"`, { cwd: process.cwd(), timeout: 15000 });
            audioBuffer = fs.readFileSync(tempFilePath);
        } catch (error: any) {
            console.error("EdgeTTS Error:", error);
            return NextResponse.json({ error: "Failed to generate audio from EdgeTTS", details: error.message }, { status: 500 });
        } finally {
            // Clean up temporary files immediately, even on error
            try {
                if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
                if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
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
