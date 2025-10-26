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
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      console.log('Requesting camera access...')
      
      // First check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera API not available in this browser. Please use file upload instead.')
        return
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      })
      
      console.log('Camera stream obtained:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to be ready
        const waitForVideo = () => {
          return new Promise<void>((resolve, reject) => {
            if (!videoRef.current) {
              reject(new Error('Video element not available'))
              return
            }
            
            const video = videoRef.current
            
            video.onloadedmetadata = () => {
              console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight)
              
              // Start playing the video
              video.play().then(() => {
                console.log('Video playing successfully')
                setIsStreaming(true)
                resolve()
              }).catch((playError) => {
                console.error('Video play failed:', playError)
                reject(playError)
              })
            }
            
            video.onerror = (e) => {
              console.error('Video error:', e)
              reject(new Error('Video playback failed'))
            }
            
            // Timeout after 10 seconds
            setTimeout(() => {
              if (!video.videoWidth || !video.videoHeight) {
                reject(new Error('Video failed to initialize within timeout'))
              }
            }, 10000)
          })
        }
        
        await waitForVideo()
      }
    } catch (err: any) {
      console.error('Camera access error:', err)
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please use file upload instead.')
      } else if (err.name === 'NotSupportedError') {
        setError('Camera not supported in this browser. Please use file upload instead.')
      } else {
        setError(`Camera error: ${err.message || 'Please check permissions or use file upload instead.'}`)
      }
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
    console.log('Capture button clicked')
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available')
      setError('Camera components not ready. Please try again.')
      return
    }

    setIsCapturing(true)
    setError(null)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      console.log('Video element state:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        paused: video.paused,
        ended: video.ended
      })

      // Ensure video is playing and has dimensions
      if (video.readyState < 2) {
        console.error('Video not ready, readyState:', video.readyState)
        setError('Video not ready. Please wait for the camera to load completely.')
        return
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video dimensions not available:', video.videoWidth, 'x', video.videoHeight)
        setError('Video dimensions not available. Please try refreshing the camera.')
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Could not get canvas context')
        setError('Failed to initialize capture canvas. Please try again.')
        return
      }

      console.log('Capturing photo with dimensions:', video.videoWidth, 'x', video.videoHeight)

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Clear canvas and draw current video frame
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      console.log('📷 Frame drawn to canvas, dimensions:', canvas.width, 'x', canvas.height)

      // Add a brief flash effect to indicate photo was taken
      if (video.parentElement) {
        video.parentElement.style.background = 'white'
        setTimeout(() => {
          if (video.parentElement) {
            video.parentElement.style.background = ''
          }
        }, 100)
      }

      // Convert canvas to blob with timeout
      const blob = await new Promise<Blob | null>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Canvas conversion timeout'))
        }, 10000)

        canvas.toBlob((result) => {
          clearTimeout(timeout)
          resolve(result)
        }, 'image/jpeg', 0.9)
      })

      if (blob && blob.size > 1000) { // Ensure minimum reasonable file size
        console.log('✅ Photo captured successfully! Size:', blob.size, 'bytes')
        const file = new File([blob], `palm-photo-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        })
        
        console.log('📁 File created:', {
          name: file.name,
          size: file.size,
          type: file.type
        })
        
        console.log('📤 Sending photo to parent component...')
        onPhotoCapture(file)
        
        console.log('🔄 Stopping camera and closing modal...')
        stopCamera()
        onClose()
        
        console.log('✨ Photo capture completed successfully!')
      } else {
        console.error('❌ Blob is too small or empty. Size:', blob?.size || 0)
        setError('Photo capture failed - image is empty or too small. Please ensure the camera is working and try again.')
      }
    } catch (error) {
      console.error('Capture error:', error)
      setError(`Failed to capture photo: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
              <button onClick={startCamera} className="start-camera-button">
                Start Camera
              </button>
            </div>
          ) : (
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
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