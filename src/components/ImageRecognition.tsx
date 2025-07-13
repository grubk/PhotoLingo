'use client';

import React, { useState, useRef, useCallback } from 'react';
import { imageClassifier, Prediction } from '@/utils/imageClassifier';

export default function ImageRecognition() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setLoading(true);
    setError('');
    setPredictions([]);

    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      // Classify the image
      const results = await imageClassifier.classifyImageFromFile(file);
      setPredictions(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during classification');
      console.error('Classification error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setPredictions([]);
    setImageUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        AI Image Recognition
      </h2>
      
      {/* Upload Section */}
      <div className="mb-6">
        <div className="flex items-center justify-center w-full">
          <label 
            htmlFor="image-upload" 
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {imageUrl ? (
              <img 
                ref={imageRef}
                src={imageUrl} 
                alt="Uploaded" 
                className="max-h-60 max-w-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
            <input 
              id="image-upload"
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        
        {imageUrl && (
          <button
            onClick={clearImage}
            className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Clear Image
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Analyzing image...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {predictions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Recognition Results:</h3>
          <div className="space-y-2">
            {predictions.slice(0, 5).map((prediction, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
              >
                <span className="font-medium text-gray-800 capitalize">
                  {prediction.className}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${prediction.probability * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {(prediction.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500 text-center">
        <p className="mt-1">Recognizes 1000+ categories of objects, animals, and scenes</p>
      </div>
    </div>
  );
}
