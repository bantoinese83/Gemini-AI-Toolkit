export default function Home() {
  const nextjsDemos = [
    {
      name: "AdFlow Studio",
      description: "Smart Ad Automation SaaS Demo — Create scroll-stopping social media ads automatically from product photos",
      icon: "🎬",
      color: "bg-blue-500",
      path: "/demos/adflow-studio",
      tech: "Next.js + TypeScript",
      features: ["Image editing", "Video generation", "Voiceover", "Multi-platform ads"]
    },
    {
      name: "TalkBase",
      description: "Conversational Knowledge Assistant — A real-time voice AI that chats, remembers, and cites current information",
      icon: "🎯",
      color: "bg-purple-500",
      path: "/demos/talkbase",
      tech: "Next.js + TypeScript",
      features: ["Conversational AI", "Real-time search", "Source citations", "Voice support"]
    },
    {
      name: "MapLens AI",
      description: "Local Store Content Engine — Generate auto-branded ads from storefront photos with Maps integration",
      icon: "🏪",
      color: "bg-green-500",
      path: "/demos/maplens-ai",
      tech: "Next.js + TypeScript",
      features: ["Storefront analysis", "Maps integration", "Local SEO", "Platform optimization"]
    }
  ];

  const viteDemos = [
    {
      name: "SceneWriter Pro",
      description: "Video Script & Production AI — Generate professional video scripts and production plans automatically",
      icon: "🎭",
      color: "bg-purple-600",
      path: "/demos/scenewriter-pro",
      tech: "Vite + TypeScript",
      features: ["Script generation", "Production planning", "SEO metadata", "Multi-platform content"]
    },
    {
      name: "GemVoice",
      description: "Voice Synthesis Features — Advanced text-to-speech with multiple voices and languages",
      icon: "🗣️",
      color: "bg-indigo-500",
      path: "/demos/gemvoice",
      tech: "Vite + TypeScript",
      features: ["Text-to-speech", "Multiple voices", "Language support", "Audio generation"]
    },
    {
      name: "InstaTranscribe",
      description: "Real-time Transcription — Instant audio-to-text conversion with speaker identification",
      icon: "📝",
      color: "bg-cyan-500",
      path: "/demos/instatranscribe",
      tech: "Vite + TypeScript",
      features: ["Real-time transcription", "Speaker ID", "Multiple languages", "Live streaming"]
    },
    {
      name: "PixSense",
      description: "Image Analysis & Processing — Advanced computer vision with object detection and analysis",
      icon: "👁️",
      color: "bg-orange-500",
      path: "/demos/pixsense",
      tech: "Vite + TypeScript",
      features: ["Object detection", "Image analysis", "Scene understanding", "Visual search"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Gemini AI Toolkit
              <span className="block text-2xl font-normal mt-2">Interactive Demos</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Explore the power of Google's Gemini AI through our collection of interactive demos.
              From automated ad creation to conversational AI, discover what's possible with cutting-edge AI technology.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Next.js Demos */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Next.js Demos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Full-stack applications built with Next.js, featuring server-side rendering and API routes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nextjsDemos.map((demo, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`${demo.color} text-white p-6`}>
                  <div className="text-4xl mb-2">{demo.icon}</div>
                  <h3 className="text-xl font-bold">{demo.name}</h3>
                  <div className="text-sm opacity-90 mt-1">{demo.tech}</div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{demo.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {demo.features.map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={demo.path}
                    className="inline-flex items-center justify-center w-full bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Try Demo
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vite Demos */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vite Demos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fast, lightweight applications built with Vite, perfect for focused feature demonstrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {viteDemos.map((demo, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`${demo.color} text-white p-6`}>
                  <div className="text-4xl mb-2">{demo.icon}</div>
                  <h3 className="text-xl font-bold">{demo.name}</h3>
                  <div className="text-sm opacity-90 mt-1">{demo.tech}</div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{demo.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {demo.features.map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={demo.path}
                    className="inline-flex items-center justify-center w-full bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Try Demo
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-gray-900 text-white rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Ready to explore the demos? Each demo is self-contained and ready to run locally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🔑</span>
              </div>
              <h3 className="font-semibold mb-2">Get API Key</h3>
              <p className="text-gray-300 text-sm">
                Get your Gemini API key from Google AI Studio to run the demos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Install & Run</h3>
              <p className="text-gray-300 text-sm">
                Each demo has its own setup instructions in the README
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Explore Features</h3>
              <p className="text-gray-300 text-sm">
                Try different inputs and see how AI transforms your content
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="https://github.com/google/gemini-ai-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}