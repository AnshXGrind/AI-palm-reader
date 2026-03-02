import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePalmAnalysis } from '../hooks/usePalmAnalysis';
import { PalmResults } from '../components/PalmResults';

export default function Home() {
  const { analyzePalm, result, loading, error, reset } = usePalmAnalysis();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      analyzePalm(acceptedFiles[0]);
    }
  }, [analyzePalm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  if (result) {
    return <PalmResults result={result} onReset={reset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Mystical background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title with mystical styling */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              🔮 AI Palm Reader
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Upload a photo of your palm and discover the secrets it holds. 
            Real AI-powered analysis using advanced hand tracking technology.
          </p>

          {/* Upload area */}
          <div
            {...getRootProps()}
            className={`
              relative group cursor-pointer
              ${isDragActive ? 'scale-105' : ''}
              transition-all duration-300
            `}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition"></div>
            <div className={`
              relative bg-gray-800/50 backdrop-blur-xl rounded-3xl p-12
              border-2 border-dashed
              ${isDragActive ? 'border-purple-400' : 'border-gray-600'}
              hover:border-purple-400 transition-all
            `}>
              <input {...getInputProps()} />
              
              <div className="space-y-6">
                {/* Upload icon */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
                    <span className="text-5xl">🤚</span>
                  </div>
                </div>

                {/* Upload text */}
                <div>
                  {isDragActive ? (
                    <p className="text-2xl text-purple-300">Drop your palm here...</p>
                  ) : (
                    <>
                      <p className="text-2xl mb-2">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-gray-400">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </>
                  )}
                </div>

                {/* Loading state */}
                {loading && (
                  <div className="mt-8">
                    <div className="flex justify-center space-x-2">
                      <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                    <p className="text-purple-300 mt-4">Analyzing your palm...</p>
                    <p className="text-sm text-gray-400 mt-2">This takes just a few seconds</p>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="mt-8 p-4 bg-red-900/50 backdrop-blur-sm rounded-xl border border-red-500">
                    <p className="text-red-200">❌ {error}</p>
                    <p className="text-sm text-red-300 mt-2">Try another image with better lighting</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg mb-2">Real AI Detection</h3>
              <p className="text-gray-400 text-sm">Mediapipe-powered hand tracking with 95%+ accuracy</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-lg mb-2">Consistent Readings</h3>
              <p className="text-gray-400 text-sm">Rule-based interpretations based on actual palm metrics</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
              <p className="text-gray-400 text-sm">All processing done locally, images never stored</p>
            </div>
          </div>

          {/* Mystical footer */}
          <div className="mt-16 text-gray-500 text-sm">
            <p>The future is written in your palms...</p>
          </div>
        </div>
      </div>
    </div>
      />

      {/* Features Section */}
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>Advanced AI Analysis</h3>
          <p>State-of-the-art computer vision and machine learning algorithms analyze palm patterns with scientific precision</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔮</div>
          <h3>Complete Future Insights</h3>
          <p>Get comprehensive predictions for love, career, health, and financial success based on ancient palmistry wisdom</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Easy File Upload</h3>
          <p>Simple drag & drop interface with support for all image formats including HEIC files from your phone</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Lightning Fast Results</h3>
          <p>Advanced processing delivers detailed personality analysis and future predictions in seconds</p>
        </div>
      </div>
    </div>
  )
}
