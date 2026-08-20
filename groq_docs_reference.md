# ZEDX-AI-Assistant - Project Context & API Reference

This document serves as the "memory" for the AI agent to understand exactly what technologies and APIs are currently active and implemented in the ZEDX-AI-Assistant project.

## 1. Groq API (Interview Engine & Scorecard Generation)
- **Interview Engine (The Brains):** During the actual mock interview, the user selects the AI brain from the UI (in `src/app/dashboard/new/page.tsx`). The available conversational models are:
  - `openai/gpt-oss-20b` (Default - Fast & efficient)
  - `openai/gpt-oss-120b` (Max power reasoning)
  - `qwen/qwen3.6-27b` (Multilingual pro)
- **Scorecard Generation:** After the interview, we specifically use the `openai/gpt-oss-120b` model with JSON Object Mode (`response_format: { type: "json_object" }`) to reliably generate and parse the final interview report (handled in `src/app/dashboard/report/[id]/page.tsx`).
- **Rate Limit & Error Handling:** The system implements a robust fallback mechanism in `src/app/api/generate/route.ts`. If a `429` (Rate Limit) occurs during generation, the API route automatically falls back to alternative models in the predefined `GROQ_MODELS` list (which strictly contains the 3 models mentioned above) using exponential backoff.

## 2. Groq Whisper (Speech-to-Text - STT)
- **Primary Use:** Transcribing the user's voice during the mock interview.
- **Load Balancing:** We use 5 separate Groq API keys (`GROQ_STT_KEY_1` to `GROQ_STT_KEY_5`) configured in `.env.local` to distribute the STT load and avoid hitting rate limits during intense interview sessions.

## 3. ElevenLabs API (Text-to-Speech - TTS)
- **Primary Use:** Speaking the AI Interviewer's questions out loud to the user.
- **Key:** Configured via `ELEVENLABS_API_KEY` in `.env.local`.

## 4. Supabase (Database & Authentication)
- **Primary Use:** Storing user data, interview history, and handling user login/sessions.
- **Keys:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---
*Note to future AI agents: Always refer to this document before making architectural changes to ensure you don't accidentally overwrite existing load balancing logic or API configurations.*
