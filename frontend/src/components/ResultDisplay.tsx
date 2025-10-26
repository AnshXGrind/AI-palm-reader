interface AnalysisResult {
  lines?: Array<{coords: number[], length: number}>
  interpretation?: string
  overlay?: string
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
          <h3>✨ Your Personal Reading</h3>
          {result.interpretation}
        </div>
      )}
    </div>
  )
}