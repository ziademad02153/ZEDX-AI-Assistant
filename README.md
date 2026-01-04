# ZEDX-AI: Professional Intelligence Systems

<div align="center">
  <img src="public/zedx-logo.png" width="160" alt="ZEDX-AI Logo" />
  <p><strong>Advanced Career Intelligence & Real-Time Professional Augmentation</strong></p>
</div>

---

## On this page
- [System Overview](#system-overview)
- [ZEDX-AI Web Platform](#zedx-ai-web-platform)
- [ZEDX-AI Desktop Application](#zedx-ai-desktop-application)
- [Core Intelligence Engine](#core-intelligence-engine)
- [Stealth & Security Infrastructure](#stealth--security-infrastructure)
- [Developer & Integration Guide](#developer--integration-guide)

---

## System Overview
ZEDX-AI is a dual-tier intelligence ecosystem designed to facilitate high-stakes professional evaluations. The system synchronizes a cross-platform web interface with a low-level system application to provide real-time, context-aware guidance. 

The architecture is built on three pillars: **Sub-second Inference**, **Absolute Stealth**, and **Contextual Precision**.

---

## ZEDX-AI Web Platform
The web platform serves as the centralized management hub and the primary interface for initial user engagement.

### Dashboard & Profile Management
- **Professional Context Integration**: Users upload technical resumes and job descriptions which are parsed and indexed into a vector-ready format for the AI engine.
- **Session Analytics**: Historical transcript review and AI response optimization tools.
- **Authentication Gateway**: Secured via Supabase Row Level Security (RLS) and OAuth2 protocols.

### Public Facing Interface
- **Optimized Landing Page**: High-performance UI built with Next.js 16, focusing on conversion and technical authority.
- **Self-Service Distribution**: Automated download routing for the desktop binaries (Windows/EXE).

---

## ZEDX-AI Desktop Application
The ZEDX-AI Desktop Console is a high-performance Electron-based application that manages the "Live Intelligence" phase.

### Stealth Scanner (OCR Engine)
- **High-Precision Capture**: Utilizes a specialized Tesseract implementation to extract text from non-copyable screen regions.
- **Detection Bypass**: The scanning process operates without traditional window hooks, ensuring invisibility to monitoring or collaboration software.

### Real-Time Stealth Overlay
- **Isolated Rendering**: Information is rendered in a specialized window layer that is physically invisible to all screen-sharing algorithms (Teams, Zoom, Google Meet).
- **Dynamic Synchronization**: Latency-optimized IPC communication between the background process and the UI thread.

### Manual AI Chat & Transcription
- **Contextual Follow-up**: Allows users to interact with the AI mid-session to clarify or expand on generated answers without breaking the transcription flow.
- **System Audio Capture**: Direct-to-buffer audio processing that extracts verbal input from both microphone and system-out channels.

---

## Core Intelligence Engine
The "ZEDX-Whiz" engine powers the underlying neural interactions.

### LLM & STT Pipeline
- **Accelerator**: Powered by Groq LPU (Language Processing Unit) to achieve transcription and response generation speeds of <0.5 seconds.
- **Models**: Dynamically routes between Llama 3.3 70B for complex technical reasoning and specialized smaller models for tactical speed.

---

## Stealth & Security Infrastructure
- **Proxy Isolation Layer**: All outbound AI traffic is routed through a specialized proxy to isolate the application environment from the target monitoring software.
- **Local-First Processing**: Sensitive audio data is processed and tokenized locally; raw audio never exits the local environment.
- **Anti-Detection Heuristics**: Custom window management policies ensure no standard API hooks are exposed during an active session.

---

## Developer & Integration Guide

### Project Structure
- `electron/`: Main process logic, IPC handlers, and system-level integrations.
- `src/app/desktop/`: Next.js components specifically for the Electron rendering environment (Overlay, Scanner).
- `src/app/download/`: Web distribution and versioning logic.
- `src/proxy.ts`: Network isolation and bypass implementation.

### Local Development
```bash
# Repository Initialization
git clone https://github.com/ziademad02153/ZEDX-AI-Assistant.git
npm install

# Service Initialization
npm run dev           # Initializes the Web Framework
npm run electron:dev  # Launches the Desktop Shell
```

---

<div align="center">
  <p><em>Standardizing Excellence in Career Intelligence.</em></p>
  <p>Built with ❤️ by <strong>Ziad Emad</strong></p>
  <p><strong>Powered by ZEDX-AI Engine</strong></p>
</div>

---
*This documentation was updated on Jan 04, 2026. ZEDX-AI remains the intellectual property of Ziad Emad.*
