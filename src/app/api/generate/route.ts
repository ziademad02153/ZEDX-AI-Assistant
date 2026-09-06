import { NextResponse } from "next/server";
import { getSystemPrompt, PromptType } from "@/lib/prompts";

export const runtime = 'edge';

// Simple in-memory rate limiter (20 requests per minute per user)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;

// Valid models per user's dashboard
const GROQ_MODELS = [
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b"
];

// Debug GET handler to verify endpoint reaches the server
export async function GET() {
    return NextResponse.json({ status: "ok", message: "AI Generate endpoint is active" });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
    try {
        // 1. Authenticate Request
        const authHeader = request.headers.get('Authorization');
        let token = authHeader?.split(' ')[1];
        if (token === 'undefined' || token === 'null') token = undefined;
        
        const isDev = process.env.NODE_ENV === 'development';
        let user: any = null;
        let profile: any = null;

        // Try getting user via header token first
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        let authError = null;

        if (token) {
            const { data } = await supabase.auth.getUser(token);
            user = data?.user || null;
        }

        // Fallback to cookies if header token is missing or invalid
        if (!user) {
            const { createClient: createServerClient } = await import("@/lib/supabase/server");
            const supabaseServer = await createServerClient();
            const { data, error } = await supabaseServer.auth.getUser();
            user = data?.user || null;
            authError = error;
        }

        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);

        if (!user) {
            if (isDev) {
                user = { id: "dev-mock-user-id" };
                profile = { tier: "pro", questions_asked: 0, subscription_expires_at: null };
            } else {
                return NextResponse.json({ error: { message: "No valid session token provided. Please log out and log in again.", details: authError?.message || "Unknown auth error" } }, { status: 401 });
            }
        } else {
            // 2. Fetch User Profile
            const { data: dbProfile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('tier, questions_asked, subscription_expires_at')
                .eq('id', user.id)
                .single();

            if (profileError || !dbProfile) {
                return NextResponse.json({ error: { message: "User profile not found. Please re-login." } }, { status: 404 });
            }
            profile = dbProfile;
        }

        let currentTier = profile.tier;

        // 3. Subscription Expiration Logic (Auto-downgrade)
        if (profile.subscription_expires_at) {
            const expiryDate = new Date(profile.subscription_expires_at);
            if (new Date() > expiryDate) {
                // Subscription expired, auto-downgrade to free
                currentTier = 'free';
                await supabaseAdmin
                    .from('profiles')
                    .update({ tier: 'free', subscription_expires_at: null })
                    .eq('id', user.id);
            }
        }

        // Rate Limiter Check (Applies to all users, even Pro)
        // Note: In Serverless (Vercel), memory Map is not shared across instances.
        // For production, this should ideally use Redis or a Supabase 'rate_limits' table.
        const now = Date.now();
        const userRateData = rateLimitMap.get(user.id);
        if (userRateData) {
            if (now > userRateData.resetTime) {
                rateLimitMap.set(user.id, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
            } else if (userRateData.count >= MAX_REQUESTS) {
                return NextResponse.json({ error: { message: "Rate limit exceeded. Please wait a minute." } }, { status: 429 });
            } else {
                userRateData.count += 1;
            }
        } else {
            rateLimitMap.set(user.id, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        }

        // 4. Teaser Mode Limit Check & Early Lock (Fix TOCTOU Race Condition)
        let isQuestionLocked = false;
        if (currentTier === 'free') {
            if (profile.questions_asked >= 4) {
                return NextResponse.json({ error: { message: "PAYWALL_LIMIT_REACHED", code: "PAYWALL_LIMIT_REACHED" } }, { status: 403 });
            }
            // Lock the question slot BEFORE making the slow Groq API call
            await supabase.rpc('increment_questions', { user_id: user.id });
            isQuestionLocked = true;
        }

        const body = await request.json();
        const { model, messages, promptType, promptContext, prompt, response_format } = body;

        // 5. Backend Model Security
        // Automatically fallback to free tier model if user doesn't have access
        let targetModel = model;
        if (targetModel === "openai/gpt-oss-120b" && currentTier !== 'ultra') {
            targetModel = "openai/gpt-oss-20b";
        }
        if (targetModel === "qwen/qwen3.6-27b" && currentTier === 'free') {
            targetModel = "openai/gpt-oss-20b";
        }

        // Generate secure system prompt on the server
        const systemPrompt = getSystemPrompt(promptType as PromptType, promptContext);

        // Gather all available Groq API keys for load balancing
        const groqApiKeys = [
            process.env.GROQ_API_KEY,
            process.env.GROQ_API_KEY_1,
            process.env.GROQ_API_KEY_2,
            process.env.GROQ_API_KEY_3,
            process.env.GROQ_API_KEY_4,
            process.env.GROQ_API_KEY_5,
            process.env.GROQ_API_KEY_6,
            process.env.GROQ_API_KEY_7,
            process.env.GROQ_API_KEY_8,
            process.env.GROQ_API_KEY_9,
            process.env.GROQ_API_KEY_10,
            process.env.GROQ_API_KEY_11,
            process.env.GROQ_API_KEY_12,
            process.env.GROQ_API_KEY_13,
            process.env.GROQ_API_KEY_14
        ].filter(Boolean) as string[];

        if (groqApiKeys.length === 0) {
            return NextResponse.json({ error: { message: "Server AI configuration missing." } }, { status: 500 });
        }

        // Shuffle keys to distribute load across all requests
        const shuffledKeys = groqApiKeys.sort(() => 0.5 - Math.random());
        const modelsToTry = targetModel ? [targetModel, ...GROQ_MODELS.filter(m => m !== targetModel)] : GROQ_MODELS;
        const uniqueModels = [...new Set(modelsToTry)];

        // Helper function to call Groq with automatic fallback across models and keys
        const callGroqWithFallback = async (userPrompt: string, overrideMessages?: any[]) => {
            let lastError: Error | null = null;
            for (const currentModel of uniqueModels) {
                for (const apiKey of shuffledKeys) {
                    try {
                        const groqMessages = overrideMessages || [{ role: "user", content: userPrompt }];
                        const finalMessages = systemPrompt ? [{ role: "system", content: systemPrompt }, ...groqMessages] : groqMessages;

                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 60000);

                        const requestBody: any = {
                            model: currentModel,
                            messages: finalMessages,
                            max_tokens: 1000,
                            temperature: 0.1
                        };

                        if (response_format) requestBody.response_format = response_format;

                        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                            body: JSON.stringify(requestBody),
                            signal: controller.signal
                        });

                        clearTimeout(timeoutId);
                        const data = await response.json();

                        if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);

                        let content = data.choices?.[0]?.message?.content;
                        if (!content) throw new Error("Empty response from AI");

                        content = content.replace(/<think>[\s\S]*?(<\/think>|$)/gi, '').trim();
                        if (!content) throw new Error("Empty response after stripping reasoning.");

                        return { content, modelUsed: currentModel };
                    } catch (error: any) {
                        console.error(`[AI Fallback] Model: ${currentModel} | Key: ***${apiKey.slice(-4)} | Error:`, error.message);
                        lastError = error;
                    }
                }
            }
            throw lastError || new Error("All Groq models and keys exhausted.");
        };

        try {
            if (promptType === "report_evaluator" && body.history) {
                const history = body.history;
                const CHUNK_SIZE = 5;
                const chunks = [];
                for (let i = 0; i < history.length; i += CHUNK_SIZE) {
                    chunks.push(history.slice(i, i + CHUNK_SIZE));
                }

                const chunkPromises = chunks.map(async (chunk) => {
                    const chunkPrompt = `Here is the interview transcript: ${JSON.stringify(chunk)}`;
                    const res = await callGroqWithFallback(chunkPrompt);
                    let content = res.content;
                    
                    const jsonMatch = content.match(/\[[\s\S]*\]/);
                    if (jsonMatch) content = jsonMatch[0];
                    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
                    
                    let parsedChunk = [];
                    try {
                        parsedChunk = JSON.parse(content);
                    } catch (parseError) {
                        const objectRegex = /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g;
                        const matches = content.match(objectRegex);
                        if (matches) {
                            parsedChunk = matches.map((m: string) => {
                                try { return JSON.parse(m); } catch (e) { return null; }
                            }).filter(Boolean);
                        }
                    }
                    if (parsedChunk && !Array.isArray(parsedChunk) && typeof parsedChunk === 'object') {
                        parsedChunk = [parsedChunk];
                    }
                    return Array.isArray(parsedChunk) ? parsedChunk : [];
                });

                const chunkResults = await Promise.all(chunkPromises);
                const allParsedReports = chunkResults.flat();

                return NextResponse.json({ parsedReport: allParsedReports, provider: "groq" });
            } else {
                // Standard single prompt execution
                const res = await callGroqWithFallback(prompt, messages);
                return NextResponse.json({ content: res.content, modelUsed: res.modelUsed, provider: "groq" });
            }
        } catch (error: any) {
            // Refund the question if generation failed
            if (isQuestionLocked) {
                await supabaseAdmin.from('profiles').update({ questions_asked: Math.max(0, profile.questions_asked) }).eq('id', user.id);
            }
            return NextResponse.json({ error: { message: error.message || "Failed to generate AI response after fallbacks." } }, { status: 500 });
        }

    } catch (error: unknown) {
        const err = error as Error;
        console.error("[API Generate] Internal Error:", err);
        const isDevEnv = process.env.NODE_ENV === 'development';
        return NextResponse.json(
            { error: { message: isDevEnv ? err.message : "An error occurred. Please try again." } },
            { status: 500 }
        );
    }
}
