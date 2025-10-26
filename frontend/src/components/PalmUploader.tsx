import { useState, useRef } from 'react'
import CameraCapture from './CameraCapture'

interface PalmUploaderProps {
  onAnalysisComplete: (result: any) => void
  onLoading: (loading: boolean) => void
}

export default function PalmUploader({ onAnalysisComplete, onLoading }: PalmUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    if (!file.type.startsWith('image/')) {
      onAnalysisComplete({ error: 'Please select an image file' })
      return
    }

    const previewUrl = URL.createObjectURL(file)
    console.log('Created preview URL:', previewUrl)
    setPreview(previewUrl)
    
    const formData = new FormData()
    formData.append('file', file)

    onLoading(true)
    try {
      // Use local API route for Vercel deployment, fallback to backend for development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/analyze' 
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/analyze')
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      
      const result = await response.json()
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      onAnalysisComplete({ 
        error: `Could not analyze the palm image. ${error instanceof Error ? error.message : 'Please try again.'}` 
      })
    } finally {
      onLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  return (
    <div className="upload-section">
      <div 
        className={`upload-area ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="upload-input"
          aria-label="Upload palm image"
        />
        
        <div className="upload-content">
          <div className="upload-icon">🤲</div>
          <h3>Upload Your Palm Photo</h3>
          <p>Drag & drop an image here, or choose an option below</p>
          <div className="upload-buttons">
            <button type="button" className="upload-button">
              📁 Choose File
            </button>
            <button 
              type="button" 
              className="camera-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowCamera(true)
              }}
            >
              📷 Take Photo
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="preview-container">
          <h4>✅ Photo Captured Successfully!</h4>
          <img 
            src={preview} 
            alt="Palm preview" 
            className="preview-image"
          />
          <p className="preview-note">Analysis will begin automatically...</p>
        </div>
      )}

      {showCamera && (
        <CameraCapture 
          onPhotoCapture={processFile}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}