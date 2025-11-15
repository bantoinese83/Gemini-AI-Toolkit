# Gemini AI Toolkit Demo Showcase

A Next.js application that serves as the central hub for exploring all Gemini AI Toolkit demos.

## Overview

This demo showcase provides an organized, beautiful interface to explore all the interactive demos built with the Gemini AI Toolkit. It features both Next.js and Vite-based demos showcasing various AI capabilities from automated content creation to conversational AI.

## Features

- **Unified Demo Hub**: Single entry point to explore all demos
- **Demo Categorization**: Organized by framework (Next.js vs Vite)
- **Feature Highlights**: Clear descriptions of each demo's capabilities
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Quick Access**: Direct links to run each demo locally

## Demos Included

### Next.js Demos (Full-Stack Applications)
- **AdFlow Studio**: Automated social media ad creation from product photos
- **TalkBase**: Conversational AI with real-time search capabilities
- **MapLens AI**: Local business content generation with Maps integration

### Vite Demos (Focused Feature Demos)
- **SceneWriter Pro**: AI-powered video script and production planning
- **GemVoice**: Advanced voice synthesis and text-to-speech
- **InstaTranscribe**: Real-time audio transcription with speaker identification
- **PixSense**: Computer vision and image analysis capabilities

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS for modern, responsive design
- **TypeScript**: Full type safety throughout
- **Architecture**: Server-side rendering with static optimization

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Architecture

The showcase is designed to:
- Provide a professional overview of all available demos
- Help users understand which demo matches their needs
- Offer clear setup instructions for each demo
- Showcase the breadth of Gemini AI Toolkit capabilities

## Individual Demo Setup

Each demo is self-contained with its own README and setup instructions:

- Set `GEMINI_API_KEY` environment variable
- Install dependencies with `npm install`
- Run with `npm run dev` (Vite) or `npm run dev` (Next.js)
- Follow demo-specific instructions in each README

## Contributing

When adding new demos:
1. Create the demo in the appropriate `/demos/` subdirectory
2. Update this showcase to include the new demo
3. Ensure the demo has proper documentation
4. Test the integration with the showcase

## Business Value

This showcase demonstrates:
- The versatility of the Gemini AI Toolkit
- Real-world applications across different industries
- Various integration patterns (Next.js vs Vite)
- Professional UI/UX implementation
- Scalable demo architecture

## License

Apache-2.0