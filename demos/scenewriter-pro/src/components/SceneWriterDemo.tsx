import { useState } from 'react';
import { SceneWriterService } from '../lib/SceneWriterService';

interface VideoScript {
  title: string;
  duration: number;
  targetAudience: string;
  script: {
    scenes: Scene[];
    voiceover: string;
    music: string;
    effects: string[];
  };
  production: {
    shots: Shot[];
    props: string[];
    locations: string[];
    talent: string[];
  };
  metadata: {
    style: string;
    tone: string;
    keywords: string[];
    hashtags: string[];
  };
}

interface Scene {
  number: number;
  duration: number;
  description: string;
  dialogue?: string;
  action: string;
  camera: string;
}

interface Shot {
  type: string;
  duration: number;
  description: string;
  notes: string;
}

const SAMPLE_TOPICS = [
  'How AI is Revolutionizing Content Creation',
  'The Future of Social Media Marketing',
  'Building a Personal Brand on YouTube',
  'Sustainable Living Tips for Beginners',
  'Cooking Healthy Meals on a Budget'
];

export function SceneWriterDemo() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(60);
  const [style, setStyle] = useState('educational');
  const [targetAudience, setTargetAudience] = useState('young professionals');
  const [platform, setPlatform] = useState('youtube');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSampleTopicSelect = (sampleTopic: string) => {
    setTopic(sampleTopic);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY environment variable not set');
      }

      const sceneWriterService = new SceneWriterService(apiKey);

      const script = await sceneWriterService.generateVideoScript({
        topic,
        duration,
        style,
        targetAudience,
        platform
      });

      setResult(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTopic('');
    setDuration(60);
    setStyle('educational');
    setTargetAudience('young professionals');
    setPlatform('youtube');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sample Topics */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">Sample Topics (Click to use)</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_TOPICS.map((sampleTopic, index) => (
            <button
              key={index}
              onClick={() => handleSampleTopicSelect(sampleTopic)}
              className="text-left p-3 bg-white rounded border hover:border-purple-300 hover:shadow-sm transition-all text-sm"
            >
              {sampleTopic}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
            <span className="text-purple-600 mr-2">🎬</span>
            Generate Video Script
          </h2>
          <p className="text-gray-600">
            Create professional video scripts and production plans with AI assistance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Video Topic *
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., How to Start a YouTube Channel"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds)
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={30}>30 seconds (Short-form)</option>
                <option value={60}>60 seconds (Standard)</option>
                <option value={120}>2 minutes (Long-form)</option>
                <option value={180}>3 minutes (Tutorial)</option>
              </select>
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                Content Style
              </label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="educational">Educational</option>
                <option value="promotional">Promotional</option>
                <option value="entertainment">Entertainment</option>
                <option value="tutorial">Tutorial</option>
                <option value="documentary">Documentary</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="young professionals">Young Professionals</option>
                <option value="students">Students</option>
                <option value="small business owners">Small Business Owners</option>
                <option value="tech enthusiasts">Tech Enthusiasts</option>
                <option value="general audience">General Audience</option>
                <option value="industry experts">Industry Experts</option>
              </select>
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                Target Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter/X</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Script...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🎬</span>
                  Generate Script
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-green-800">Video Script Generated Successfully!</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">📝 Script Overview</h4>

              {/* Title and Basic Info */}
              <div className="bg-white rounded-lg p-4 border mb-4">
                <h5 className="font-medium text-gray-900 mb-2">{result.title}</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Duration:</strong> {result.duration} seconds</p>
                  <p><strong>Audience:</strong> {result.targetAudience}</p>
                  <p><strong>Style:</strong> {result.metadata.style}</p>
                  <p><strong>Tone:</strong> {result.metadata.tone}</p>
                </div>
              </div>

              {/* Script Content */}
              <div className="bg-white rounded-lg p-4 border mb-4">
                <h5 className="font-medium text-gray-900 mb-3">🎭 Script Breakdown</h5>
                <div className="space-y-3">
                  {result.script.scenes.map((scene) => (
                    <div key={scene.number} className="border-l-4 border-purple-200 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">Scene {scene.number}</span>
                        <span className="text-sm text-gray-500">{scene.duration}s</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{scene.description}</p>
                      <p className="text-xs text-gray-500 italic">{scene.camera}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voiceover and Audio */}
              <div className="bg-white rounded-lg p-4 border">
                <h5 className="font-medium text-gray-900 mb-2">🎵 Audio & Voiceover</h5>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Voiceover:</strong> {result.script.voiceover}</p>
                  <p><strong>Music:</strong> {result.script.music}</p>
                  <div>
                    <strong>Effects:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {result.script.effects.map((effect, idx) => (
                        <li key={idx}>{effect}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🎬 Production Plan</h4>

              {/* Shot List */}
              <div className="bg-white rounded-lg p-4 border mb-4">
                <h5 className="font-medium text-gray-900 mb-3">📷 Shot List</h5>
                <div className="space-y-2">
                  {result.production.shots.map((shot, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-gray-900">{shot.type}</span>
                        <span className="text-sm text-gray-500 ml-2">({shot.duration}s)</span>
                      </div>
                      <span className="text-xs text-gray-600">{shot.notes}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Production Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h5 className="font-medium text-gray-900 mb-2">🎭 Talent</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.production.talent.map((person, idx) => (
                      <li key={idx}>• {person}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border">
                  <h5 className="font-medium text-gray-900 mb-2">📦 Props</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.production.props.map((prop, idx) => (
                      <li key={idx}>• {prop}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* SEO Metadata */}
              <div className="bg-white rounded-lg p-4 border">
                <h5 className="font-medium text-gray-900 mb-2">🚀 SEO & Distribution</h5>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <strong>Keywords:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.metadata.keywords.map((keyword, idx) => (
                        <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Hashtags:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.metadata.hashtags.map((hashtag, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
