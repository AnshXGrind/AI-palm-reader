import { useState, useEffect } from 'react'

export default function Debug() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Update window width
    const updateWidth = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth <= 640)
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#0a0a0a', 
      color: '#e2e8f0',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#3b82f6' }}>🔍 Debug Information</h1>
      
      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '1rem',
        borderRadius: '10px',
        margin: '1rem 0'
      }}>
        <h2>Screen Information</h2>
        <p>Window Width: {windowWidth}px</p>
        <p>Is Mobile: {isMobile ? 'Yes' : 'No'}</p>
        <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Loading...'}</p>
      </div>

      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '1rem',
        borderRadius: '10px',
        margin: '1rem 0'
      }}>
        <h2>Feature Cards Test</h2>
        <p>All four feature cards should be visible below:</p>
      </div>

      {/* Features Section with inline styles for testing */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : windowWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '1.5rem',
        margin: '2rem 0',
        padding: '0 0.5rem'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid #3b82f6',
          borderRadius: '15px',
          padding: '1.5rem',
          textAlign: 'center',
          minHeight: '180px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
          <h3 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>Advanced AI Analysis</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            State-of-the-art computer vision and machine learning algorithms analyze palm patterns with scientific precision
          </p>
        </div>
        
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid #3b82f6',
          borderRadius: '15px',
          padding: '1.5rem',
          textAlign: 'center',
          minHeight: '180px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔮</div>
          <h3 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>Complete Future Insights</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Get comprehensive predictions for love, career, health, and financial success based on ancient palmistry wisdom
          </p>
        </div>
        
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid #3b82f6',
          borderRadius: '15px',
          padding: '1.5rem',
          textAlign: 'center',
          minHeight: '180px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
          <h3 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>Smart Photo Capture</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Intelligent camera system with guided positioning and real-time quality optimization for perfect palm scans
          </p>
        </div>
        
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid #3b82f6',
          borderRadius: '15px',
          padding: '1.5rem',
          textAlign: 'center',
          minHeight: '180px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
          <h3 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>Lightning Fast Results</h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
            Advanced processing delivers detailed personality analysis and future predictions in seconds
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '1rem',
        borderRadius: '10px',
        margin: '1rem 0'
      }}>
        <h2>CSS Test</h2>
        <p>Grid Template Columns: {isMobile ? '1fr' : windowWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'}</p>
        <p>Expected Layout: {isMobile ? 'Single Column (Mobile)' : windowWidth < 1024 ? 'Two Columns (Tablet)' : 'Four Columns (Desktop)'}</p>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <a 
          href="/" 
          style={{ 
            color: '#3b82f6', 
            textDecoration: 'none',
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            border: '1px solid #3b82f6'
          }}
        >
          ← Back to Main Site
        </a>
      </div>
    </div>
  )
}