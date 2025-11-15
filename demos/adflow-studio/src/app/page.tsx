'use client';

import { useState } from 'react';
import { AdFlowDemo } from '@/components/AdFlowDemo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">AdFlow Studio</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart Ad Automation SaaS Demo — Let small businesses create scroll-stopping social media ads automatically
          </p>
        </header>

        <AdFlowDemo />
      </div>
    </div>
  );
}