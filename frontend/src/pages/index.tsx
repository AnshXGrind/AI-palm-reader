import { useState } from 'react'
import PalmUploader from '../components/PalmUploader'
import ResultDisplay from '../components/ResultDisplay'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)

  const handleAnalysisComplete = (analysisResult: any) => {
    setResult(analysisResult)
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>🔮 AI Palm Reader</h1>
        <p>Your future in your hand — literally. Upload a photo of your palm, and let AI interpret your story.</p>
      </div>

      {/* Upload Section */}
      <PalmUploader 
        onAnalysisComplete={handleAnalysisComplete}
        onLoading={setLoading}
      />

      {/* Results Section */}
      <ResultDisplay 
        result={result}
        loading={loading}
      />

      {/* Features Section */}
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered Analysis</h3>
          <p>Advanced computer vision detects and analyzes your palm lines with precision</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">�</div>
          <h3>Live Camera Capture</h3>
          <p>Take photos directly with your device camera or upload existing images</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant Results</h3>
          <p>Get your personalized palm reading in seconds, not minutes</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Private & Secure</h3>
          <p>Your photos are processed locally and never stored or shared</p>
        </div>
      </div>
    </div>
  )
}
