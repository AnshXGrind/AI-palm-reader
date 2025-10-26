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
        <p>Discover your destiny through the ancient art of palmistry, powered by cutting-edge AI technology. Your future is written in the lines of your palm.</p>
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
          <div className="feature-icon">�</div>
          <h3>Advanced AI Analysis</h3>
          <p>State-of-the-art computer vision and machine learning algorithms analyze palm patterns with scientific precision</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">�</div>
          <h3>Complete Future Insights</h3>
          <p>Get comprehensive predictions for love, career, health, and financial success based on ancient palmistry wisdom</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Smart Photo Capture</h3>
          <p>Intelligent camera system with guided positioning and real-time quality optimization for perfect palm scans</p>
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
