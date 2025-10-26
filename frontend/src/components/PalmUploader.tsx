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
    if (!file.type.startsWith('image/')) {
      onAnalysisComplete({ error: 'Please select an image file' })
      return
    }

    setPreview(URL.createObjectURL(file))
    
    const formData = new FormData()
    formData.append('file', file)

    onLoading(true)
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      onAnalysisComplete({ 
        error: 'Could not reach the AI analysis server. Please ensure the backend is running at http://localhost:8000' 
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
          <h4>Preview</h4>
          <img 
            src={preview} 
            alt="Palm preview" 
            className="preview-image small"
          />
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