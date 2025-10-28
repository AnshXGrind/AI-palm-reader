import { useState, useRef, useCallback, useEffect } from 'react'

interface CameraCaptureProps {
  onPhotoCapture: (file: File) => void
  onClose: () => void
}

// Browser compatibility check
const checkBrowserCompatibility = () => {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  const isFirefox = /Firefox/.test(navigator.userAgent)
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  const isEdge = /Edg/.test(navigator.userAgent)
  
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  const hasWebRTC = !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection || (window as any).mozRTCPeerConnection)
  
  return {
    isCompatible: hasGetUserMedia && hasWebRTC,
    browser: isChrome ? 'Chrome' : isFirefox ? 'Firefox' : isSafari ? 'Safari' : isEdge ? 'Edge' : 'Unknown',
    hasGetUserMedia,
    hasWebRTC
  }
}

export default function CameraCapture({ onPhotoCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [componentReady, setComponentReady] = useState(false)
  const [domReady, setDomReady] = useState(false)
  const [renderKey, setRenderKey] = useState(0)
  const [initializationTimeout, setInitializationTimeout] = useState(false)

  // Ensure component and DOM elements are ready when mounted
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 30 // 3 seconds total
    
    const checkDomReadiness = () => {
      if (videoRef.current && canvasRef.current) {
        setDomReady(true)
        setComponentReady(true)
      } else {
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkDomReadiness, 100)
        } else {
          console.warn('DOM elements not ready after timeout')
          setInitializationTimeout(true)
        }
      }
    }

    const initialTimer = setTimeout(checkDomReadiness, 50)
    return () => clearTimeout(initialTimer)
  }, [renderKey])

  // Additional safety check for video element
  useEffect(() => {
    if (domReady && videoRef.current) {
      // Ensure video element is properly initialized
      const video = videoRef.current
      video.setAttribute('playsinline', 'true')
      video.setAttribute('webkit-playsinline', 'true')
      video.setAttribute('muted', 'true')
      
      console.log('Video element prepared:', video.readyState)
    }
  }, [domReady])

  const startCamera = useCallback(async () => {
    console.log('🎬 Starting camera...')
    
    setIsStarting(true)
    setError(null)
    
    try {
      // Check browser compatibility first
      const compatibility = checkBrowserCompatibility()
      console.log('Browser compatibility:', compatibility)
      
      if (!compatibility.isCompatible) {
        throw new Error(`Camera not supported in ${compatibility.browser}. Please try Chrome, Firefox, or Safari, or use file upload instead.`)
      }
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser. Please use file upload instead.')
      }

      // Enhanced readiness check
      console.log('Checking component readiness...', { componentReady, domReady, videoElement: !!videoRef.current })
      
      // Wait for both component and DOM to be ready
      let waitTime = 0
      const maxWaitTime = 3000 // 3 seconds max wait
      
      while ((!componentReady || !domReady || !videoRef.current) && waitTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100))
        waitTime += 100
        
        // Re-check DOM readiness
        if (videoRef.current && canvasRef.current && !domReady) {
          setDomReady(true)
          setComponentReady(true)
        }
      }
      
      // Final comprehensive check with fallback
      if (!videoRef.current || !canvasRef.current) {
        console.error('DOM elements not available:', { 
          video: !!videoRef.current, 
          canvas: !!canvasRef.current,
          waitTime 
        })
        
        // Try to recreate video element as last resort
        if (videoRef.current && !canvasRef.current) {
          throw new Error('Canvas element not available. Please refresh the page.')
        }
        
        if (!videoRef.current && canvasRef.current) {
          throw new Error('Video element not available. Please refresh the page or try a different browser.')
        }
        
        throw new Error('Camera interface components not available. Please refresh the page.')
      }

      // Try to recreate/reset video element for better compatibility
      recreateVideoElement()
      console.log('✅ All elements ready, proceeding with camera initialization')
      
      // Try different camera configurations
      let stream: MediaStream
      
      // First try rear camera
      try {
        console.log('Trying rear camera...')
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 720, max: 1280 },
            height: { ideal: 480, max: 720 }
          },
          audio: false
        })
      } catch (rearError) {
        console.log('Rear camera failed, trying front camera...')
        
        // Fallback to front camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 720, max: 1280 },
              height: { ideal: 480, max: 720 }
            },
            audio: false
          })
        } catch (frontError) {
          console.log('Front camera failed, trying any available camera...')
          
          // Last resort: any camera
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 720, max: 1280 },
              height: { ideal: 480, max: 720 }
            },
            audio: false
          })
        }
      }
      
      console.log('📹 Camera stream obtained successfully')
      
      // Double-check video element availability
      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop())
        throw new Error('Video element became unavailable during initialization')
      }
      
      const video = videoRef.current
      
      // Set up video element
      video.srcObject = stream
      video.setAttribute('playsinline', 'true') // Important for iOS
      video.setAttribute('autoplay', 'true')
      video.setAttribute('muted', 'true')
      
      // Wait for video to load and start playing
      await new Promise<void>((resolve, reject) => {
        let timeoutId: NodeJS.Timeout
        
        const handleCanPlay = () => {
          console.log('� Video can play, dimensions:', video.videoWidth, 'x', video.videoHeight)
          clearTimeout(timeoutId)
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
          
          // Ensure video starts playing
          video.play()
            .then(() => {
              console.log('▶️ Video playing successfully!')
              setIsStreaming(true)
              resolve()
            })
            .catch(reject)
        }
        
        const handleError = (e: Event) => {
          console.error('❌ Video error:', e)
          clearTimeout(timeoutId)
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
          reject(new Error('Video failed to load'))
        }
        
        // Set up event listeners
        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('error', handleError)
        
        // Timeout after 10 seconds
        timeoutId = setTimeout(() => {
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
          reject(new Error('Camera initialization timeout'))
        }, 10000)
        
        // Try to load the video
        video.load()
      })
      
      console.log('🎉 Camera started successfully!')
      
    } catch (err: any) {
      console.error('💥 Camera error:', err)
      
      // Stop any tracks that might have been created
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
      
      // Set appropriate error message with more specific guidance
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please click the camera icon in your browser\'s address bar to allow camera access, then try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please ensure your camera is connected and not being used by another application.')
      } else if (err.name === 'NotSupportedError') {
        setError('Camera not supported in this browser. Please try Chrome, Firefox, or Safari, or use file upload instead.')
      } else if (err.name === 'NotReadableError') {
        setError('Camera is busy. Please close other apps using the camera (like Zoom, Skype, etc.) and try again.')
      } else if (err.message?.includes('Video element') || err.message?.includes('Camera interface')) {
        const compatibility = checkBrowserCompatibility()
        setError(`Camera interface issue detected. Browser: ${compatibility.browser} | Video Element: ${videoRef.current ? 'Available' : 'Missing'} | Canvas Element: ${canvasRef.current ? 'Available' : 'Missing'}. Please refresh the page or try file upload.`)
      } else {
        const compatibility = checkBrowserCompatibility()
        const diagnostics = `Browser: ${compatibility.browser} (Compatible: ${compatibility.isCompatible ? 'Yes' : 'No'})`
        setError(`Camera initialization failed: ${err.message || 'Unknown error'}. ${diagnostics}. Please try file upload instead.`)
      }
    } finally {
      setIsStarting(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }, [])

  // Fallback function to recreate video element if needed
  const recreateVideoElement = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current
      video.load() // Reset video element
      video.setAttribute('playsinline', 'true')
      video.setAttribute('webkit-playsinline', 'true') 
      video.setAttribute('muted', 'true')
      video.setAttribute('autoplay', 'true')
      
      console.log('Video element recreated and configured')
      return true
    }
    return false
  }, [])

  const capturePhoto = useCallback(async () => {
    console.log('📸 Capture button clicked')
    
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera components not ready. Please try again.')
      return
    }

    setIsCapturing(true)
    setError(null)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Check if video is ready
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        setError('Camera not ready. Please wait for the camera to load completely.')
        return
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setError('Failed to initialize capture canvas.')
        return
      }

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Add camera flash effect
      const flashDiv = document.createElement('div')
      flashDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0.8;
        z-index: 9999;
        pointer-events: none;
      `
      document.body.appendChild(flashDiv)
      setTimeout(() => {
        document.body.removeChild(flashDiv)
      }, 200)

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve, reject) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
        // Add timeout
        setTimeout(() => resolve(null), 5000)
      })

      if (!blob || blob.size < 1000) {
        setError('Photo capture failed. Please try again.')
        return
      }

      console.log('✅ Photo captured successfully! Size:', blob.size, 'bytes')
      
      // Create file from blob
      const file = new File([blob], `palm-photo-${Date.now()}.jpg`, { 
        type: 'image/jpeg'
      })
      
      // Send to parent component
      onPhotoCapture(file)
      
      // Close camera
      stopCamera()
      onClose()
      
    } catch (error) {
      console.error('Capture error:', error)
      setError('Failed to capture photo. Please try again.')
    } finally {
      setIsCapturing(false)
    }
  }, [onPhotoCapture, onClose, stopCamera])

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  return (
    <div className="camera-overlay">
      <div className="camera-modal">
        <div className="camera-header">
          <h3>📷 Capture Your Palm</h3>
          <button onClick={handleClose} className="close-button">✕</button>
        </div>

        <div className="camera-content">
          {error ? (
            <div className="camera-error">
              <div className="error-icon">⚠️</div>
              <h4>Camera Issue Detected</h4>
              <p>{error}</p>
              <div className="error-actions">
                <button 
                  onClick={() => {
                    console.log('Retry button clicked - resetting state')
                    setError(null)
                    setComponentReady(false)
                    setDomReady(false)
                    setIsStreaming(false)
                    
                    // Force a complete re-render
                    setRenderKey(prev => prev + 1)
                    
                    // Force a complete re-initialization
                    setTimeout(() => {
                      if (videoRef.current && canvasRef.current) {
                        setDomReady(true)
                        setComponentReady(true)
                        console.log('Retry: Components re-initialized')
                      } else {
                        console.log('Retry: Elements still not ready')
                      }
                    }, 300)
                  }} 
                  className="retry-button"
                >
                  🔄 Try Again
                </button>
                <button onClick={handleClose} className="error-button">
                  📁 Use File Upload Instead
                </button>
                <button 
                  onClick={() => {
                    // Create a temporary file input as emergency fallback
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        onPhotoCapture(file)
                        handleClose()
                      }
                    }
                    input.click()
                  }}
                  className="emergency-button"
                >
                  🚨 Emergency Upload
                </button>
              </div>
            </div>
          ) : !isStreaming ? (
            <div className="camera-start">
              <div className="camera-icon">📱</div>
              <h4>Ready to capture your palm?</h4>
              <p>Make sure you have good lighting and hold your palm clearly in view</p>
              
              {/* Debug status panel */}
              <div className="debug-status">
                <small>
                  Status: {componentReady && domReady ? '✅ Ready' : '⏳ Initializing...'} | 
                  Video: {videoRef.current ? '✅' : '❌'} | 
                  Canvas: {canvasRef.current ? '✅' : '❌'} |
                  Browser: {checkBrowserCompatibility().browser}
                  {initializationTimeout && ' | ⚠️ Initialization timeout'}
                </small>
              </div>

              {initializationTimeout && (
                <div className="timeout-warning">
                  <p>⚠️ Camera interface is taking longer than expected to load. This might be a browser compatibility issue.</p>
                  <button 
                    onClick={handleClose}
                    className="fallback-upload-button"
                  >
                    📁 Switch to File Upload
                  </button>
                </div>
              )}
              
              <button 
                onClick={startCamera}
                className="start-camera-button"
                disabled={isStarting || !componentReady}
              >
                {isStarting ? '⏳ Starting Camera...' : !componentReady ? '⏳ Preparing...' : '🎥 Start Camera'}
              </button>
              {error && (
                <div className="camera-retry-container">
                  <button 
                    onClick={startCamera}
                    className="retry-camera-button"
                    disabled={isStarting}
                  >
                    🔄 Retry Camera
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="camera-view" key={`camera-view-${renderKey}`}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                controls={false}
                className="camera-video enhanced"
                key={`video-${renderKey}`}
              />
              <canvas
                ref={canvasRef}
                className="capture-canvas hidden"
                key={`canvas-${renderKey}`}
              />
              <div className="palm-guide">
                <div className="guide-outline">
                  <span>Place palm here</span>
                </div>
              </div>
              <div className="camera-controls">
                <button onClick={handleClose} className="cancel-button" disabled={isCapturing}>
                  Cancel
                </button>
                <button 
                  onClick={capturePhoto} 
                  className="capture-button"
                  disabled={isCapturing}
                >
                  {isCapturing ? '⏳ Capturing...' : '📸 Capture'}
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden-canvas" />
      </div>
    </div>
  )
}