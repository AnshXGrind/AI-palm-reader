import { useState } from 'react'

export default function CameraDebug() {
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  
  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  const testCameraAccess = async () => {
    addDebugInfo('Testing camera access...')
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addDebugInfo('❌ getUserMedia not supported')
        return
      }
      
      addDebugInfo('✅ getUserMedia API available')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      })
      
      addDebugInfo(`✅ Camera stream obtained: ${stream.getVideoTracks().length} video tracks`)
      
      // Stop the stream
      stream.getTracks().forEach(track => {
        track.stop()
        addDebugInfo(`✅ Track stopped: ${track.kind}`)
      })
      
    } catch (error: any) {
      addDebugInfo(`❌ Camera error: ${error.name} - ${error.message}`)
    }
  }

  const clearDebug = () => {
    setDebugInfo([])
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '1rem',
      borderRadius: '10px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      fontSize: '0.8rem',
      zIndex: 9999
    }}>
      <h4>🔧 Camera Debug</h4>
      <button 
        onClick={testCameraAccess}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          margin: '0.5rem 0.5rem 0.5rem 0',
          cursor: 'pointer'
        }}
      >
        Test Camera
      </button>
      <button 
        onClick={clearDebug}
        style={{
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          margin: '0.5rem 0',
          cursor: 'pointer'
        }}
      >
        Clear
      </button>
      <div style={{ marginTop: '1rem' }}>
        {debugInfo.map((info, index) => (
          <div key={index} style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>
            {info}
          </div>
        ))}
      </div>
    </div>
  )
}