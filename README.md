<div align="center">
  <img src="public/zedx-logo.png" alt="ZEDX Copilot Logo" width="200"/>

  # ZEDX Copilot
  ### Real-Time Meeting & Accessibility Assistant
</div>

## Overview
**ZEDX Copilot** is a high-performance, real-time audio processing and transcription assistant designed to make online meetings accessible, productive, and inclusive. By bridging local desktop environments with powerful cloud-based Large Language Models (LLMs), ZEDX Copilot provides instant captions, contextual insights, and meeting summaries specifically tailored to aid users with hearing impairments or those operating in fast-paced professional environments.

Built using a hybrid architecture of a Next.js (React) front-end wrapped inside a custom Electron.js container, ZEDX provides deep system integration for seamless, secure, and unobtrusive operation across Windows and macOS platforms.

---

## Key Capabilities

### 🎙️ Live Audio Processing (STT Engine)
Powered by an optimized, low-latency implementation of Groq's Whisper API and local Web Speech API fallbacks:
- **Zero-Latency Transcription:** Transcribes system audio and microphone input instantly.
- **Multilingual Support:** Native processing for English, Arabic (including dialects like Egyptian), Spanish, and 30+ other languages.
- **VAD (Voice Activity Detection):** Smart silence-trimming (tuned to 12ms thresholds) to prevent API payload bloat and ensure crisp context windows.

### 🧠 Real-Time Cognitive Parsing (LLM Engine)
Integrates tightly with LLaMA 3.1 architectures to process spoken text live:
- **Meeting Context Awareness:** Analyzes incoming transcripts against pre-loaded meeting agendas or context documents to provide relevant insights.
- **Global Best Practices Retrieval:** Answers technical queries or meeting topics by pulling strictly verified information dynamically without hallucination.
- **Accessibility Auto-Summarization:** Generates instant bulleted summaries of loud, fast-paced discussions for users requiring cognitive assistance.

### 🛡️ Enterprise-Grade Security
- **Data Sovereignty:** Fully isolated API requests using ephemeral tokens. No data is stored persistently outside of user-controlled bounds.
- **Row-Level Security (RLS):** Meeting transcripts and user data are secured via strict Supabase RLS policies ensuring complete isolation between organizational accounts.
- **Opaque Token Authentication:** Upgraded from legacy JWTs to mathematically secure Publishable API integrations to prevent token sniffing.

---

## System Architecture

ZEDX Copilot employs a sophisticated Micro-Frontend / IPC (Inter-Process Communication) topology:

1. **The Core (Next.js 16 + React 19):** Hosts the heavy React logic, managing `Zustand` state models for audio streams, UI updates, and API lifecycles.
2. **The Wrapper (Electron.js):** Acts as the bridge to system-level APIs. Using `desktopCapturer` and deeply isolated `preload.js` scripts, it enables the app to intercept desktop audio cleanly and provides the "Live Accessibility Overlay".
3. **The IPC Bridge:** Connects React's web context to Node.js hardware access (microphone permissions, screen constraints, auto-updater mechanisms) without compromising browser sandbox security.

## Engineering Challenges Overcome
- **Audio Device Partitioning:** Resolving sync race conditions between Chrome's `MediaDevices` API and Electron's strict media permissions.
- **Micro-Latency API Handling:** Implementing `TransformStream` pipelines in Next.js Edge Runtime to stream Server-Sent Events (SSE) back to the client word-by-word.
- **React Hydration in Node:** Maintaining a "White-Screen Free" boot sequence by isolating state management from `window` objects during Next.js SSR passes.

---

## Future Roadmap (MLH Milestones)
- **Offline Transcription Models:** Integrated ONNX WebAssembly (WASM) models to allow 100% offline, privacy-first transcription.
- **Speaker Diarization:** AI-powered voice clustering to label "Speaker 1" and "Speaker 2" dynamically in multi-party meetings.
- **Sign-Language Avatar Integration:** Forward-looking research for WebGL integration.

### Developed by Ziad Emad
*Committed to engineering software that bridges the gap between complex AI and daily human accessibility.*
