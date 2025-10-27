import { useState, useRef, useCallback } from 'react'

interface CameraCaptureProps {
  onPhotoCapture: (file: File) => void
  onClose: () => void
}

export default function CameraCapture({ onPhotoCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    console.log('🎬 Starting camera...')
    
    setIsStarting(true)
    setError(null)
    
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser. Please use file upload instead.')
      }
      
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
      
      console.log('📹 Requesting camera access...')
      
      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop())
        throw new Error('Video element not available')
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
      
      // Set appropriate error message
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please check if your camera is connected and try again.')
      } else if (err.name === 'NotSupportedError') {
        setError('Camera not supported in this browser. Please try a different browser or use file upload.')
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application. Please close other apps using the camera.')
      } else {
        setError(`Camera error: ${err.message || 'Please check permissions or use file upload instead.'}`)
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
              <p>{error}</p>
              <button onClick={handleClose} className="error-button">
                Use File Upload Instead
              </button>
            </div>
          ) : !isStreaming ? (
            <div className="camera-start">
              <div className="camera-icon">📱</div>
              <h4>Ready to capture your palm?</h4>
              <p>Make sure you have good lighting and hold your palm clearly in view</p>
              <button 
                onClick={startCamera}
                className="start-camera-button"
                disabled={isStarting}
              >
                {isStarting ? '⏳ Starting Camera...' : '🎥 Start Camera'}
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
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                controls={false}
                className="camera-video"
              />
              <canvas
                ref={canvasRef}
                className="capture-canvas"
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