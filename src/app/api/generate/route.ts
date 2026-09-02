import { NextResponse } from "next/server";
import { getSystemPrompt, PromptType } from "@/lib/prompts";

// Simple in-memory rate limiter (20 requests per minute per user)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;

// Fallback models in case the selected one fails
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
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
            return NextResponse.json({ error: { message: "Unauthorized. Please sign in." } }, { status: 401 });
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: { message: "Invalid authentication token." } }, { status: 401 });
        }

        // 2. Fetch User Profile
        const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('tier, questions_asked, subscription_expires_at')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: { message: "User profile not found. Please re-login." } }, { status: 404 });
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

        // 4. Teaser Mode Limit Check
        if (currentTier === 'free' && profile.questions_asked >= 4) {
            return NextResponse.json({ error: { message: "PAYWALL_LIMIT_REACHED", code: "PAYWALL_LIMIT_REACHED" } }, { status: 403 });
        }

        const body = await request.json();
        const { model, messages, promptType, promptContext, prompt, response_format } = body;

        // 5. Backend Model Security (Prevent API hijacking)
        if (model === "meta-llama/llama-3-70b-instruct" && currentTier !== 'ultra') {
            return NextResponse.json({ error: { message: "Unauthorized model. Requires Ultra tier." } }, { status: 403 });
        }
        if (model === "openai/gpt-oss-120b" && currentTier === 'free') {
            return NextResponse.json({ error: { message: "Unauthorized model. Requires Pro or Ultra tier." } }, { status: 403 });
        }
        
        // Generate secure system prompt on the server
        const systemPrompt = getSystemPrompt(promptType as PromptType, promptContext);

        const isDev = process.env.NODE_ENV === 'development';
        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            return NextResponse.json({ error: { message: "Server AI configuration missing." } }, { status: 500 });
        }

        const modelsToTry = model ? [model, ...GROQ_MODELS.filter(m => m !== model)] : GROQ_MODELS;
        const uniqueModels = [...new Set(modelsToTry)];
        let lastError: Error | null = null;

        for (const targetModel of uniqueModels) {
            try {
                const groqMessages = messages || [{ role: "user", content: prompt }];
                const finalMessages = systemPrompt ? [{ role: "system", content: systemPrompt }, ...groqMessages] : groqMessages;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                const requestBody: any = {
                    model: targetModel,
                    messages: finalMessages,
                    max_tokens: 4096,
                    temperature: 0.1
                };
                
                if (response_format) requestBody.response_format = response_format;

                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${groqApiKey}`
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const data = await response.json();

                if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
                
                const content = data.choices?.[0]?.message?.content;
                if (!content) throw new Error("Empty response from AI");

                // 3. Increment Questions Count for Free Users (Fixes Race Condition via RPC)
                if (profile.tier === 'free') {
                    await supabase.rpc('increment_questions', { user_id: user.id });
                }

                return NextResponse.json({ content, modelUsed: targetModel, provider: "groq" });

            } catch (error: unknown) {
                const err = error as Error;
                lastError = err;
                if (err.message.includes("429") || err.message.includes("quota")) continue;
            }
        }

        return NextResponse.json({
            error: { message: "AI temporarily unavailable. Please try again later." }
        }, { status: 503 });

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
