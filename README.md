# ZEDX-AI Assistant: The AI Interview Copilot

![ZEDX-AI Hero](public/hero-banner.png)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.0-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Ace your next job interview with a real-time, privacy-first AI assistant.**

</div>

---

## Overview

**ZEDX-AI Assistant** is a cutting-edge AI Interview Assistant designed to help you land your dream job. It listens to your interview in real-time, understands the context from your **Resume** and the **Job Description**, and generates the perfect answer instantly using **Google Gemini 2.0**.

Unlike other tools, ZEDX-AI Assistant runs **entirely in your browser** (Client-Side), ensuring your data never leaves your device except to talk to the AI API.

## System Architecture

```mermaid
graph TD
    subgraph "Your Browser (Client-Side)"
        Mic[Microphone Input] -->|Web Speech API| STT[Speech-to-Text]
        STT -->|Transcript| Logic[Core Logic]
        
        Resume[Resume Data] -->|LocalStorage| Logic
        JD[Job Description] -->|LocalStorage| Logic
        
        Logic -->|Prompt Engineering| API_Call[API Request]
        
        API_Call -->|Response| TTS[Text-to-Speech]
        TTS -->|Audio| Speaker[Speaker Output]
    end
    
    subgraph "Google Cloud"
        API_Call <-->|Encrypted| Gemini[Gemini 2.0 Flash]
    end
    
    style Mic fill:#f9f,stroke:#333,stroke-width:2px
    style Gemini fill:#bbf,stroke:#333,stroke-width:2px
    style Logic fill:#bfb,stroke:#333,stroke-width:2px
```

## User Flow

```mermaid
sequenceDiagram
    participant User
    participant App as ZEDX-AI Assistant
    participant AI as Google Gemini
    
    User->>App: Upload Resume & Job Description
    App->>App: Store Context Locally
    User->>App: Start Interview
    
    loop Real-Time Assistance
        User->>App: Speaks (Interview Question)
        App->>App: Transcribes Audio
        App->>AI: Send Transcript + Context
        AI->>App: Generate Professional Answer
        App->>User: Display & Speak Answer
    end
```

## Key Features

| Feature | Description |
| :--- | :--- |
| **Real-Time Transcription** | Uses the Web Speech API for instant, zero-latency speech-to-text. |
| **Context-Aware AI** | Upload your Resume and Job Description. The AI *knows* who you are and what you're applying for. |
| **Multi-Model Intelligence** | Automatically falls back between `gemini-2.0-flash-lite`, `gemini-1.5-flash`, and `gemini-pro` to ensure 100% uptime. |
| **Auto-Answer Mode** | Detects when you stop speaking and generates an answer automatically. |
| **Privacy First** | No database. No server. Your API keys and transcripts are stored in your browser's LocalStorage. |
| **Multi-Language Support** | Fluent in English, Arabic, Spanish, and French. |
| **Stealth Mode** | Toggle the camera and UI to keep the assistant invisible during screen shares. |

## Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
*   **AI**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)
*   **Speech**: Native Web Speech API (SpeechRecognition & SpeechSynthesis)

## Screenshots

| **Dashboard** | **Interview Interface** |
|:---:|:---:|
| ![Dashboard](public/dashboard-preview.png) | ![Interview](public/interview-preview.png) |

*(Note: Add your own screenshots to `public/` folder)*

## Getting Started

### Prerequisites

*   Node.js 18+ installed.
*   A free [Google Gemini API Key](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ziademad02153/ZEDX-AI-Assistant.git
    cd ZEDX-AI-Assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```


5.  **Setup**
    *   Go to **Start New Interview**.
    *   Paste your Resume & Job Description.
    *   Enter your Gemini API Key when prompted.
    *   Start aceing your interviews!

## Privacy Policy

We believe in **Local-First Software**.
*   **API Keys**: Stored in `localStorage`. Never sent to our servers.
*   **Transcripts**: Processed in memory.
*   **Resumes**: Parsed client-side.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Star this repo if you find it useful!**

Made by [Ziad Emad]

</div>
