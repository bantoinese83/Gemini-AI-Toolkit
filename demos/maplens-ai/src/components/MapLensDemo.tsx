'use client';

import { useState, useEffect, useRef } from 'react';

interface SampleLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
}

interface LocationData {
  coordinates: { latitude: number; longitude: number };
  address: string;
  searchResults?: string;
  rating?: number;
  reviews?: string;
  popularTimes?: string;
}

interface BrandedContent {
  imageAnalysis: string;
  brandStrategy: string;
  taglines: string;
  visualStyle: string;
}

interface AdVariant {
  platform: string;
  content: string;
  voiceover?: string;
  specs: {
    format: string;
    size: string;
    duration: string;
    style: string;
  };
}

interface AdResult {
  businessName: string;
  locationData: LocationData;
  enhancedImage: string;
  brandedContent: BrandedContent;
  ads: AdVariant[];
}

export function MapLensDemo() {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('restaurant');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [specialOffers, setSpecialOffers] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sampleLocations, setSampleLocations] = useState<SampleLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load sample locations
    fetch('/api/sample-locations')
      .then(res => res.json())
      .then(data => setSampleLocations(data))
      .catch(err => console.error('Failed to load sample locations:', err));
  }, []);

  const handleSampleLocationSelect = (location: SampleLocation) => {
    setBusinessName(location.name);
    setBusinessType(location.type);
    setAddress(location.address);
    setLatitude(location.lat.toString());
    setLongitude(location.lng.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('businessName', businessName);
      formData.append('businessType', businessType);
      formData.append('address', address);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('specialOffers', specialOffers);
      formData.append('targetPlatform', targetPlatform);

      if (selectedFile) {
        formData.append('storefrontImage', selectedFile);
      }

      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate ad');
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
    setBusinessName('');
    setBusinessType('restaurant');
    setAddress('');
    setLatitude('');
    setLongitude('');
    setSpecialOffers('');
    setTargetPlatform('all');
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sample Locations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Sample Locations (Click to use)</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sampleLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSampleLocationSelect(location)}
              className="text-left p-3 bg-white rounded border hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="font-medium text-gray-900">{location.name}</div>
              <div className="text-sm text-gray-600">{location.address}</div>
              <div className="text-xs text-blue-600 capitalize">{location.type}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
            <span className="text-green-600 mr-2">🏪</span>
            Create Local Business Ads
          </h2>
          <p className="text-gray-600">
            Generate auto-branded short ads from storefront photos with real-time location data and Maps integration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Joe's Coffee Shop"
                required
              />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              <select
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail Store</option>
                <option value="spa">Spa & Wellness</option>
                <option value="automotive">Automotive</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="123 Main St, Anytown, USA"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="40.7128"
                required
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="-74.0060"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="specialOffers" className="block text-sm font-medium text-gray-700 mb-2">
              Special Offers
            </label>
            <input
              type="text"
              id="specialOffers"
              value={specialOffers}
              onChange={(e) => setSpecialOffers(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Free WiFi, 20% off first visit, etc."
            />
          </div>

          <div>
            <label htmlFor="storefrontImage" className="block text-sm font-medium text-gray-700 mb-2">
              Storefront Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                id="storefrontImage"
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
                    <p className="text-sm text-gray-600">Click to upload storefront photo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="targetPlatform" className="block text-sm font-medium text-gray-700 mb-2">
              Target Platform
            </label>
            <select
              id="targetPlatform"
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Platforms (Google Maps, Facebook, Instagram)</option>
              <option value="google-maps">Google Maps</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Ads...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">📸</span>
                  Generate Ads
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
            <h3 className="text-lg font-medium text-green-800">Local Ads Generated Successfully!</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Business: {result.businessName}</h4>

              {/* Location Data */}
              <div className="bg-white rounded-lg p-4 border mb-4">
                <h5 className="font-medium text-gray-900 mb-2">📍 Location Data</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Address:</strong> {result.locationData.address}</p>
                  <p><strong>Rating:</strong> ⭐ {result.locationData.rating?.toFixed(1) || 'N/A'}</p>
                  <p><strong>Reviews:</strong> {result.locationData.reviews}</p>
                  <p><strong>Popular Times:</strong> {result.locationData.popularTimes}</p>
                </div>
              </div>

              {/* Enhanced Image */}
              {result.enhancedImage && (
                <div className="bg-white rounded-lg p-4 border mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">🖼️ Enhanced Storefront</h5>
                  <img
                    src={`data:image/jpeg;base64,${result.enhancedImage}`}
                    alt="Enhanced storefront"
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* Brand Strategy */}
              <div className="bg-white rounded-lg p-4 border">
                <h5 className="font-medium text-gray-900 mb-2">🎨 Brand Strategy</h5>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Visual Style:</strong> {result.brandedContent.visualStyle}</p>
                  <p className="whitespace-pre-wrap">{result.brandedContent.brandStrategy}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Generated Ads</h4>

              <div className="space-y-4">
                {result.ads.map((ad, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium capitalize text-gray-900">{ad.platform}</span>
                      <span className="text-xs text-gray-500">{ad.specs.size} • {ad.specs.duration}</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <p className="whitespace-pre-wrap">{ad.content}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p><strong>Format:</strong> {ad.specs.format}</p>
                      <p><strong>Style:</strong> {ad.specs.style}</p>
                      {ad.voiceover && <p>🎵 Voiceover included</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Taglines */}
              <div className="bg-white rounded-lg p-4 border mt-4">
                <h5 className="font-medium text-gray-900 mb-2">🏷️ Taglines & Captions</h5>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.brandedContent.taglines}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
