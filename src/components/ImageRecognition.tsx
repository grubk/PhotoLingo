'use client';

import React, { useState, useRef, useCallback } from 'react';
import { imageClassifier, Prediction } from '@/utils/imageClassifier';
import { translateText } from '@/utils/translator';
import SpotlightCard from './spotlightcard';
import { SUPPORTED_LANGUAGES } from '@/utils/languages';
interface TranslationData {
  original: string;
  translated: string;
  language: string;
  probability: number;
}

export default function ImageRecognition() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es'); // Default to Spanish
  const [translationPanel, setTranslationPanel] = useState<TranslationData | null>(null);
  const [translating, setTranslating] = useState(false);
  const [historyPanel, setHistoryPanel] = useState(false);
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
    setTranslationPanel(null);

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

  const handlePredictionClick = useCallback(async (prediction: Prediction) => {
    setTranslating(true);
    setError('');
    
    try {
      console.log('Attempting translation:', {
        sourceLang: 'en',
        targetLang: selectedLanguage,
        text: prediction.className
      });
      
      const translated = await translateText('en', selectedLanguage, prediction.className);
      
      console.log('Translation result:', translated);
      
      if (!translated) {
        throw new Error(`Translation service returned no result. The language '${selectedLanguage}' might not be supported by this API.`);
      }
      
      const languageName = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage;
      
      const translationData = {
        originalWord: prediction.className,
        targetLanguage: selectedLanguage,
        targetLanguageName: languageName,
        translatedWord: translated,
      };
      
      const timestamp = new Date().toISOString();
      localStorage.setItem(`translation_${timestamp}`, JSON.stringify(translationData));
      
      setTranslationPanel({
        original: prediction.className,
        translated: translated,
        language: languageName,
        probability: prediction.probability
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(`Translation error: ${errorMessage}`);
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  }, [selectedLanguage]);

  const clearImage = useCallback(() => {
    setPredictions([]);
    setImageUrl('');
    setError('');
    setTranslationPanel(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const closeTranslationPanel = useCallback(() => {
    setTranslationPanel(null);
  }, []);

  const openHistoryPanel = useCallback(() => {
    setHistoryPanel(true);
  }, []);

  const closeHistoryPanel = useCallback(() => {
    setHistoryPanel(false);
  }, []);

  const getTranslationHistory = useCallback(() => {
    const history = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('translation_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          history.push({
            ...data,
            timestamp: key.replace('translation_', '')
          });
        } catch (error) {
          console.error('Error parsing translation history:', error);
        }
      }
    }
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  return (
    <SpotlightCard className= "custom-spotlight-card" spotlightColor="rgba(0, 0, 0, 0.3)">
      
      {/* Language Selection */}
      <div className="mb-6">
          <label htmlFor="language-select" className="block text-lg font-medium text-white/80 mb-2">
          Select Translation Language:
        </label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-3 bg-white/20 hover:bg-white/30 text-white/80 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-gray-500">
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <div className="flex items-center justify-center w-full">
          <label 
            htmlFor="image-upload" 
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-white border-dashed rounded-lg cursor-pointer bg-transparent hover:bg-white/10 transition-colors"
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
                <svg className="w-8 h-8 mb-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-white">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-white/80">PNG, JPG, GIF up to 10MB</p>
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
            className="mt-4 w-full bg-red-400/40 hover:bg-red-400/50 text-white font-bold py-2 px-4 rounded transition-colors"
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

      {/* Results as Clickable Buttons */}
      {predictions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-white/80">Recognition Results (Click to translate):</h3>
          <div className="grid grid-cols-1 gap-2">
            {predictions.slice(0, 5).map((prediction, index) => (
              <button
                key={index}
                onClick={() => handlePredictionClick(prediction)}
                disabled={translating}
                className="flex justify-between items-center p-3 bg-blue-50/50 hover:bg-blue-100/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium text-gray-800 capitalize">
                  {prediction.className}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600/80 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${prediction.probability * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700/80">
                    {(prediction.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation Panel */}
      {translationPanel && (
        <div className="fixed inset-0 backdrop-blur-md bg-none flex items-center justify-center z-50">
          <div className="bg-white/80 rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl">
            <button
              onClick={closeTranslationPanel}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold mb-4 text-gray-800">Translation Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Original (English):</label>
                <p className="text-lg font-semibold text-gray-800 capitalize">{translationPanel.original}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Translation ({translationPanel.language}):
                </label>
                <p className="text-lg font-semibold text-blue-600">{translationPanel.translated}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Confidence:</label>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${translationPanel.probability * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {(translationPanel.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Translating State */}
      {translating && (
        <div className="fixed inset-0 backdrop-blur-md bg-none bg-opacity-0 flex items-center justify-center z-50">
          <div className="bg-white/80 rounded-lg p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Translating...</p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-white/80 text-center">
        <p className="mt-1">Recognizes 1000+ categories of objects, animals, and scenes</p>
        <p className="mt-1">Click on any result to see translation in {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}</p>
      </div>

      {/* Translation History Button */}
      <div className="mt-6 text-center">
        <button
          onClick={openHistoryPanel}
          className="bg-blue-600/50 hover:bg-blue-700/50 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Translation History
        </button>
      </div>

      {/* Translation History Panel */}
      {historyPanel && (
        <div className="fixed inset-0 backdrop-blur-md bg-none flex items-center justify-center z-50">
          <div className="bg-white/80 rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl h-2/3 flex flex-col">
            <button
              onClick={closeHistoryPanel}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold mb-4 text-gray-800">Translation History</h3>
            
            <div className="overflow-y-auto flex-1">
              {getTranslationHistory().length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Begin using PhotoLingo and see what you translated here.
                </p>
              ) : (
                <div className="space-y-3">
                  {getTranslationHistory().map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex-1">
                          <span className="font-medium text-gray-800 capitalize">{item.originalWord}</span>
                        </div>
                        <div className="flex flex-col items-center mx-4">
                          <span className="text-xs text-gray-500 mb-1">{item.targetLanguageName}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        <div className="flex-1 text-right">
                          <span className="font-medium text-blue-600">{item.translatedWord}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
