interface AnalysisResult {
  lines?: Array<{coords: number[], length: number, type?: string, strength?: number}>
  interpretation?: string
  overlay?: string
  predictions?: {
    nextYear: string[]
    next5Years: string[]
    longTerm: string[]
  }
  personality?: {
    primaryTraits: string[]
    strengths: string[]
    challenges: string[]
    idealCareer: string
  }
  compatibility?: {
    bestMatches: string[]
    goodMatches: string[]
    challenges: string[]
  }
  error?: string
}

interface ResultDisplayProps {
  result: AnalysisResult | null
  loading: boolean
}

export default function ResultDisplay({ result, loading }: ResultDisplayProps) {
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>AI is analyzing your palm lines...</p>
        <small>This may take a few moments</small>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="result-section">
      <h2>🔮 Your Palm Reading</h2>
      
      {result.error && (
        <div className="error">
          <strong>Oops!</strong> {result.error}
        </div>
      )}

      {result.overlay && (
        <div className="preview-section">
          <div className="preview-card">
            <h3>Detected Lines</h3>
            <img 
              src={result.overlay} 
              alt="Palm analysis with detected lines" 
              className="preview-image"
            />
          </div>
          
          {result.lines && (
            <div className="preview-card">
              <h3>Line Analysis</h3>
              <p><strong>Lines detected:</strong> {result.lines.length}</p>
              <p><strong>Total line length:</strong> {result.lines.reduce((sum, line) => sum + line.length, 0)}px</p>
              <details>
                <summary>Technical Details</summary>
                <pre className="technical-details">
                  {JSON.stringify(result.lines, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      {result.interpretation && (
        <div className="interpretation">
          <h3>🔮 Your Complete Palm Reading</h3>
          <div className="reading-content">
            {result.interpretation.split('\n').map((line, index) => (
              <p key={index} className={line.startsWith('**') ? 'reading-section' : 'reading-text'}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {result.predictions && (
        <div className="predictions-section">
          <h3>🔮 Future Predictions</h3>
          <div className="predictions-grid">
            <div className="prediction-card">
              <h4>📅 Next Year</h4>
              <ul>
                {result.predictions.nextYear.map((prediction, index) => (
                  <li key={index}>{prediction}</li>
                ))}
              </ul>
            </div>
            <div className="prediction-card">
              <h4>🎯 Next 5 Years</h4>
              <ul>
                {result.predictions.next5Years.map((prediction, index) => (
                  <li key={index}>{prediction}</li>
                ))}
              </ul>
            </div>
            <div className="prediction-card">
              <h4>🌟 Long Term</h4>
              <ul>
                {result.predictions.longTerm.map((prediction, index) => (
                  <li key={index}>{prediction}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {result.personality && (
        <div className="personality-section">
          <h3>🎭 Personality Analysis</h3>
          <div className="personality-grid">
            <div className="personality-card">
              <h4>✨ Your Traits</h4>
              <ul>
                {result.personality.primaryTraits.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
            <div className="personality-card">
              <h4>💪 Strengths</h4>
              <ul>
                {result.personality.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="personality-card">
              <h4>🎯 Ideal Career</h4>
              <p>{result.personality.idealCareer}</p>
            </div>
          </div>
        </div>
      )}

      {result.compatibility && (
        <div className="compatibility-section">
          <h3>💕 Love Compatibility</h3>
          <div className="compatibility-grid">
            <div className="compatibility-card best">
              <h4>💖 Best Matches</h4>
              <ul>
                {result.compatibility.bestMatches.map((match, index) => (
                  <li key={index}>{match}</li>
                ))}
              </ul>
            </div>
            <div className="compatibility-card good">
              <h4>💚 Good Matches</h4>
              <ul>
                {result.compatibility.goodMatches.map((match, index) => (
                  <li key={index}>{match}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}