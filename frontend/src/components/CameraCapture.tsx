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
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video metadata to load
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
          setIsStreaming(true)
        }
        
        // Handle video errors
        videoRef.current.onerror = (e) => {
          console.error('Video error:', e)
          setError('Video playback failed. Please try again.')
        }
      }
    } catch (err: any) {
      console.error('Camera access error:', err)
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please use file upload instead.')
      } else {
        setError('Could not access camera. Please check permissions or use file upload instead.')
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
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available')
      return
    }

    setIsCapturing(true)
    setError(null)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        console.error('Could not get canvas context')
        setError('Failed to initialize capture. Please try again.')
        return
      }

      // Ensure video is ready and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video dimensions not available')
        setError('Video not ready. Please wait a moment and try again.')
        return
      }

      console.log('Capturing photo with dimensions:', video.videoWidth, 'x', video.videoHeight)

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob and create file
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      })

      if (blob) {
        console.log('Photo captured successfully, size:', blob.size, 'bytes')
        const file = new File([blob], `palm-photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
        onPhotoCapture(file)
        stopCamera()
        onClose()
      } else {
        console.error('Failed to create blob from canvas')
        setError('Failed to capture photo. Please try again.')
      }
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