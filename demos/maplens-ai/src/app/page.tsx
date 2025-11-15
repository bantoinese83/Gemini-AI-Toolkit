'use client';

import { MapLensDemo } from '@/components/MapLensDemo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-green-600">MapLens AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Local Store Content Engine — Generate auto-branded short ads from storefront photos with real-time Maps data.
          </p>
        </header>

        <MapLensDemo />
      </div>
    </div>
  );
}