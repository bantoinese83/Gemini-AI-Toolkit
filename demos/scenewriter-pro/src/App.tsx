import { useState } from 'react'
import { SceneWriterDemo } from './components/SceneWriterDemo'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-purple-600">SceneWriter Pro</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Video Script & Production AI Demo — Generate professional video scripts and production plans automatically.
          </p>
        </header>

        <SceneWriterDemo />
      </div>
    </div>
  )
}

export default App
