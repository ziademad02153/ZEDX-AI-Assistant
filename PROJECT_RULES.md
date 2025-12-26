# Professional Implementation Guidelines: ZEDX-AI

## UI/UX Engineering and Branding
- Aesthetic Integrity: The ZEDX Cyberpunk aesthetic (Black, Gray, Emerald) is the project identity. All UI changes must adhere to this high-contrast, premium design system.
- Micro-Animations: Use Framer Motion for smooth transitions, hover effects, and shimmer animations to maintain a premium feel.
- Branding: ZEDX-AI must be consistently capitalized and styled. Avoid zedx or lowercase variants in user-facing text.

## Advanced Transcription Engine (ZEDX-Whiz)
> Our proprietary transcription strategy ensures 99.9% uptime and ultra-low latency.

| Environment | Engine | Scaling | Logic |
|-------------|--------|---------|-------|
| Web Browser | Web Speech API | Native | Zero-latency, privacy-first, free. |
| Desktop Elite | Groq-Whisper-Turbo | 5-Key Load Balanced | High-fidelity transcription for system audio capture. |

### Technical Directives:
1. High Availability: The 5-key round-robin system in transcribe/route.ts is a critical architecture choice. It bypasses Groq Rate Limits and ensures sub-second responses.
2. Stealth Mode Logic: The overlay MUST remain untraceable. This is achieved through transparent windowing and hardware-level capture in Electron.
3. Smart VAD (Digital Silence Filter): Our custom VAD implementation filters background noise and digital silence before hitting the API, saving bandwidth and improving accuracy.

## Technical Excellence Standards
- Performance First: All React components should be optimized with useMemo and useCallback where necessary to ensure the overlay does not lag during intense GPU tasks.
- Enterprise-Grade Security: Row-Level Security (RLS) is the backbone of our data privacy. Every query must respect the auth.uid() = user_id constraint.
- Code Cleanliness: No placeholder code or TODOs in the production branch. All variables must be strictly typed (TypeScript).

## Communication and Ethics
- Technical Honesty: We do not hide limitations; we engineer solutions for them. If a feature (like 100% hallucination-free AI) is impossible, we implement filters to minimize its impact.
- Expert Guidance: We provide the USER with technical options, highlighting the Premium path over the Minimum Viable path.

## The Whisper Hallucination Shield
- Hallucination Filtering: We implement minimum-duration and noise-floor filters locally.
- Response Validation: AI responses are validated for professional tone and context matching before display.

## Strategic Constraints
- No Heavy Subsystems: We avoid Python/Docker dependencies to keep the installer footprint under 500MB and user-friendly.
- Next.js + Electron Core: Our stack is chosen for its balance of power and portability.

---
**ZEDX-AI: Professionalism through Technical Dominance.**
