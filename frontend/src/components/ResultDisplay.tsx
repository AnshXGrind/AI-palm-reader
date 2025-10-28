interface AnalysisResult {
  success?: boolean
  classified_lines?: {
    heart_line: Array<{coords: number[], length: number, angle?: number}>
    head_line: Array<{coords: number[], length: number, angle?: number}>
    life_line: Array<{coords: number[], length: number, angle?: number}>
    fate_line: Array<{coords: number[], length: number, angle?: number}>
    minor_lines: Array<{coords: number[], length: number, angle?: number}>
  }
  palm_features?: {
    palm_shape: string
    palm_size: number
    line_density: number
    dominant_line_direction: string
    heart_line_strength: number
    head_line_strength: number
    life_line_strength: number
    fate_line_strength: number
    minor_lines_count: number
  }
  interpretation?: string
  overlay?: string
  analysis_summary?: {
    total_major_lines: number
    minor_lines_count: number
    palm_shape: string
    analysis_confidence: string
  }
  // Legacy support
  lines?: Array<{coords: number[], length: number}>
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
            <h3>🖐️ Analyzed Palm Lines</h3>
            <img 
              src={result.overlay} 
              alt="Palm analysis with detected lines" 
              className="preview-image"
            />
            <div className="analysis-info">
              {result.analysis_summary && (
                <>
                  <p><strong>Analysis Quality:</strong> {result.analysis_summary.analysis_confidence.toUpperCase()}</p>
                  <p><strong>Major Lines:</strong> {result.analysis_summary.total_major_lines}</p>
                  <p><strong>Minor Lines:</strong> {result.analysis_summary.minor_lines_count}</p>
                  <p><strong>Palm Shape:</strong> {result.analysis_summary.palm_shape.charAt(0).toUpperCase() + result.analysis_summary.palm_shape.slice(1)}</p>
                </>
              )}
            </div>
          </div>
          
          {result.classified_lines && (
            <div className="preview-card">
              <h3>� Line Classification</h3>
              <div className="line-breakdown">
                <div className="line-stat">
                  <span className="line-color heart"></span>
                  <strong>Heart Line:</strong> {result.classified_lines.heart_line.length} detected
                </div>
                <div className="line-stat">
                  <span className="line-color head"></span>
                  <strong>Head Line:</strong> {result.classified_lines.head_line.length} detected
                </div>
                <div className="line-stat">
                  <span className="line-color life"></span>
                  <strong>Life Line:</strong> {result.classified_lines.life_line.length} detected
                </div>
                <div className="line-stat">
                  <span className="line-color fate"></span>
                  <strong>Fate Line:</strong> {result.classified_lines.fate_line.length} detected
                </div>
                <div className="line-stat">
                  <span className="line-color minor"></span>
                  <strong>Minor Lines:</strong> {result.classified_lines.minor_lines.length} detected
                </div>
              </div>
              
              {result.palm_features && (
                <details className="palm-features">
                  <summary>Advanced Palm Features</summary>
                  <div className="features-grid">
                    <p><strong>Line Density:</strong> {result.palm_features.line_density.toFixed(2)}</p>
                    <p><strong>Dominant Direction:</strong> {result.palm_features.dominant_line_direction}</p>
                    <p><strong>Heart Line Strength:</strong> {result.palm_features.heart_line_strength}</p>
                    <p><strong>Head Line Strength:</strong> {result.palm_features.head_line_strength}</p>
                    <p><strong>Life Line Strength:</strong> {result.palm_features.life_line_strength}</p>
                    <p><strong>Fate Line Strength:</strong> {result.palm_features.fate_line_strength}</p>
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {result.interpretation && (
        <div className="interpretation">
          <div className="reading-content">
            {result.interpretation.split('\n').map((line, index) => {
              // Handle different line types for better formatting
              if (line.startsWith('🌟') || line.startsWith('👤') || line.startsWith('💝') || 
                  line.startsWith('🧠') || line.startsWith('🌱') || line.startsWith('🎯') || 
                  line.startsWith('🔮') || line.startsWith('✨')) {
                return <h3 key={index} className="section-header">{line}</h3>
              } else if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={index} className="reading-section">{line.replace(/\*\*/g, '')}</h4>
              } else if (line.startsWith('•')) {
                return <div key={index} className="reading-point">• {line.substring(2)}</div>
              } else if (line.trim() === '') {
                return <br key={index} />
              } else {
                return <p key={index} className="reading-text">{line}</p>
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}