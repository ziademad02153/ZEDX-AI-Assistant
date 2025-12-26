# Professional Standards and Logic Guidelines: ZEDX-AI

## Architecture Overview
ZEDX-AI is a high-fidelity intelligence platform. Every implementation must respect the balance between stealth, speed, and data integrity.

## Engineering Principles
- Performance Hierarchy: Local processing is preferred for latency; Cloud scaling is utilized for intelligence depth.
- Branding Standards: Use "ZEDX-AI" in all professional communications. Visuals must adhere to the high-contrast Emerald/Dark Gray palette.
- Documentation Integrity: Maintain clean, information-dense Markdown files without decorative elements.

## Transcription Logic (ZEDX-Whiz)
The transcription system is divided into two operational modes:
1. Native Web Mode: Implementation via Web Speech API. Reserved for browser-based interactions.
2. Desktop Console Mode: Implementation via 5-key load-balanced Groq Whisper LPU. Reserved for low-level system capture.

### Critical Directives:
- VAD Implementation: All audio streams must pass through the Voice Activity Detection filter to prevent API resource depletion during silence.
- Round-Robin Scaling: Ensure the 5-key logic in the API layer is never compromised, as it is essential for bypass of standard rate limiting.

## Security Framework
- Row-Level Security: Mandatory for all tables. No data leak between user sessions is acceptable.
- Context Isolation: Desktop windows must run with `contextIsolation: true` to prevent unauthorized cross-process communication.

## Ethics and Accuracy
- Technical Transparency: Limitations of the Whisper model (hallucination in silence) are countered by system-level filters, not concealed by marketing text.
- Expert Trajectory: Always prioritize the technical "Premium" path over basic alternatives during development.

---
Engineering Excellence. 
Professional Dominance.
🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️ (في الشات بس!)
