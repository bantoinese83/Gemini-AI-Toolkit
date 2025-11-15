# AdFlow Studio — Smart Ad Automation SaaS Demo

A Next.js TypeScript application that demonstrates automated social media ad creation using Google's Gemini AI toolkit.

## Features

- **Product Image Processing**: Upload product photos and AI enhances them for advertising
- **Background Removal**: Automatic background removal and professional styling
- **Multi-Platform Ads**: Generate optimized ads for TikTok, Instagram, and YouTube
- **AI Video Generation**: Create scroll-stopping video ads with Veo 3
- **Voiceover Generation**: Add professional voiceovers using Audio Spark
- **Real-time Processing**: See results instantly with modern React UI

## Concept

AdFlow Studio lets small businesses create scroll-stopping social media ads automatically. Users upload a product photo or type a short description, and Gemini:

1. **Edits the image** - Removes background, enhances colors, makes it professional
2. **Animates the product** - Creates short vertical videos for TikTok, Instagram, YouTube Shorts
3. **Adds voiceover** - Generates compelling audio narration
4. **Optimizes for platforms** - Different formats, durations, and styles per platform

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI**: Tailwind CSS with modern React components
- **Backend**: Next.js API routes
- **AI**: Gemini AI Toolkit (gemini-ai-toolkit)
- **Styling**: Responsive design with gradient backgrounds

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Add your Gemini API key:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Routes

- `POST /api/create-ad` - Create automated ads from product data

## Demo Flow

1. **Input**: Product name, description, and/or image upload
2. **Processing**: AI analyzes and enhances the product image
3. **Generation**: Creates platform-specific ad variants with video and audio
4. **Output**: Displays results with download-ready assets

## Features Demonstrated

- Image editing and enhancement
- Video generation with Veo 3
- Text-to-speech with Audio Spark
- Multi-modal AI processing
- Real-time API integration
- Modern web development with Next.js

## Business Value

Perfect for:
- Small business owners creating social media ads
- Marketing agencies scaling content production
- E-commerce stores needing product videos
- Local businesses wanting professional advertising

## License

Apache-2.0