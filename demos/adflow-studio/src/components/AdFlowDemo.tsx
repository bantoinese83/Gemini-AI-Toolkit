'use client';

import { useState, useRef } from 'react';

interface AdVariant {
  platform: string;
  video: string;
  voiceover: string;
  duration: number;
  aspectRatio: string;
}

interface AdResult {
  productName: string;
  processedImage: string;
  adVariants: AdVariant[];
  timestamp: string;
}

export function AdFlowDemo() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('productDescription', productDescription);
      formData.append('targetPlatform', targetPlatform);

      if (selectedFile) {
        formData.append('productImage', selectedFile);
      }

      const response = await fetch('/api/create-ad', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ad');
      }

      const data: AdResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setTargetPlatform('all');
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
            <span className="text-blue-600 mr-2">🎬</span>
            Create Automated Ads
          </h2>
          <p className="text-gray-600">
            Upload a product photo or describe your product, and we'll create scroll-stopping ads for TikTok, Instagram, and YouTube.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Premium Coffee Maker"
              required
            />
          </div>

          <div>
            <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="productImage"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              >
                {selectedFile ? (
                  <div>
                    <div className="text-green-600 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-400 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Click to upload product image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Product Description {!selectedFile && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your product in detail (features, benefits, target audience, etc.)"
              required={!selectedFile}
            />
          </div>

          <div>
            <label htmlFor="targetPlatform" className="block text-sm font-medium text-gray-700 mb-2">
              Target Platform
            </label>
            <select
              id="targetPlatform"
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Platforms (TikTok, Instagram, YouTube)</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Ads...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🎬</span>
                  Create Ads
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
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-green-800">Ad Created Successfully!</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Product: {result.productName}</h4>
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-gray-600 mb-2">Enhanced Product Image:</p>
                <img
                  src={`data:image/jpeg;base64,${result.processedImage}`}
                  alt="Enhanced product"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-sm"
                />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Generated Ad Variants:</h4>
              <div className="space-y-3">
                {result.adVariants.map((variant, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize text-gray-900">{variant.platform}</span>
                      <span className="text-sm text-gray-500">{variant.duration}s • {variant.aspectRatio}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>🎬 Video generated</p>
                      <p>🎵 Voiceover created</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Created at: {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
