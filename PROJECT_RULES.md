# Project Rules & Implementation Guidelines

## UI/UX Preservation Policy
- **NO UNAUTHORIZED UI CHANGES**: The current design system (Green/White/Black aesthetic) is final. Do NOT modify layouts, colors, or components unless explicitly requested by the USER.
- **Functional-Only Updates**: All improvements to the Speech-to-Text (STT) or AI logic must be integrated into the existing UI framework.
- **Preserve Branding**: The "ZEDX-AI" branding and associated color palettes must remain consistent.

## Speech-to-Text (STT) Architecture - CRITICAL
> ⚠️ **DO NOT CHANGE THIS WITHOUT EXPLICIT USER PERMISSION**

| Platform | STT Engine | API Keys Required | Notes |
|----------|-----------|-------------------|-------|
| **Website** (`/interview`) | **Web Speech API** (Browser Native) | ❌ None | FREE, runs in browser. **NEVER CHANGE THIS.** |
| **Desktop App** (Electron Overlay) | **Groq Whisper API** | ✅ 5 Keys (Load Balanced) | Fast, accurate. Keys in `transcribe/route.ts` |

### Rules:
1. **Website Live Transcription**: MUST use `Web Speech API` (SpeechRecognition). It's free and works offline. Do NOT replace with Groq or any paid API.
2. **Desktop App Live Transcription**: Uses `Groq Whisper API` with 5 hardcoded keys for round-robin load balancing. This is for the hidden overlay feature.
3. **The 5 Groq Keys** in `/api/transcribe/route.ts` are **ONLY** for the Desktop App's STT. Do NOT use them for the Website.

## Technical Standards
- **Local AI Priority**: All STT and AI processing should happen locally (Transformers.js + WebGPU) when possible to ensure speed and privacy.
- **Cache Management**: When updating shared services (like STT), ensure class/file naming conventions prevent Electron/Next.js caching issues.
- **Error Handling**: Always provide clean, non-intrusive error feedback to the user within the existing UI components.

## Communication
- **Clarification First**: If a technical fix requires a UI change, ask the USER for permission BEFORE implementing the change.
- **Ask Before Any Change**: Always ask the USER before making any architectural or significant code changes.
- **Concise Reporting**: Keep summaries and technical explanations focused on the functional result.

## Honesty Policy - CRITICAL
> ⚠️ **الـ AI لازم يكون صادق دايماً**

1. **لا تنفذ حاجة مش حقيقية**: لو حاجة مش هتشتغل تقنياً، قول كده بصراحة.
2. **لو الـ User طلب حاجة مستحيلة**: اشرحله ليه مش ممكنة واقترح بديل.
3. **لا تكذب أبداً**: لو مش عارف، قول "معرفش" بدل ما تألف.
4. **صحح نفسك**: لو غلطت، اعترف بالغلطة وصلحها فوراً.

### أمثلة:
- ❌ "Web Speech API بيشتغل في Electron" → غلط (مش بيشتغل)
- ✅ "Web Speech API للـ Browsers فقط، Electron محتاج Groq Whisper"

## Whisper Reality - CRITICAL
> ⚠️ **حقيقة علمية ثابتة**

1. **Whisper بيهلوس على السكوت** - هذه مشكلة معروفة في كل versions (OpenAI, Groq, local)
2. **لا يوجد حل سحري** - يمكن فقط **تقليل** الهلوسة، مش **إزالتها 100%**
3. **Groq Free Tier غير مستقر** - الـ latency بتتراوح بين 500ms و 10 ثواني

### Solutions & Reality:
| Solution | Status | Result |
|----------|--------|--------|
| **Smart VAD (JS)** | ✅ **ACTIVE** | Filters 90% of noise. Sub-second latency. |
| **Web Speech API** | ✅ **ACTIVE** | Zero hallucinations, but Browser only. |
| **Python Server** | ❌ **ABANDONED** | Too heavy (3GB+). Not user-friendly. |

### Binding Rule for AI:
- ❌ **NEVER suggest Python/Docker solutions** for this project again.
- ✅ **Stick to Next.js + Electron + Web APIs.**
