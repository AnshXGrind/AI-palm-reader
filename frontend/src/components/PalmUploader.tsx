import { useState, useRef } from 'react'

// HEIC conversion function type
type HeicConverter = (options: {
  blob: Blob | File;
  toType: string;
  quality?: number;
}) => Promise<Blob | Blob[]>;

// Dynamic import for HEIC support (client-side only)
let heic2any: HeicConverter | null = null;

// Load heic2any dynamically
const loadHeicConverter = async (): Promise<HeicConverter | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    if (!heic2any) {
      // Use dynamic import for better compatibility
      const heicModule = await import('heic2any');
      heic2any = heicModule.default || heicModule;
    }
    return heic2any;
  } catch (error) {
    console.warn('HEIC conversion not available:', error);
    return null;
  }
}

interface PalmUploaderProps {
  onAnalysisComplete: (result: any) => void
  onLoading: (loading: boolean) => void
}

export default function PalmUploader({ onAnalysisComplete, onLoading }: PalmUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    // Enhanced file type detection
    const fileName = file.name.toLowerCase()
    const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif'
    const isRegularImage = file.type.startsWith('image/') && !isHeic
    const isImageByExtension = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName)
    
    if (!isRegularImage && !isHeic && !isImageByExtension) {
      onAnalysisComplete({ error: 'Please select a valid image file (JPG, PNG, HEIC, etc.)' })
      return
    }

    let processedFile = file
    let previewUrl: string

    // Convert HEIC to JPEG if needed
    if (isHeic) {
      try {
        console.log('HEIC file detected, attempting conversion...')
        onLoading(true)
        
        // Load heic2any dynamically
        const converter = await loadHeicConverter()
        
        if (!converter) {
          throw new Error('HEIC converter not available')
        }
        
        console.log('Converting HEIC file...')
        const convertedBlob = await converter({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        })
        
        // Handle both single blob and array return types
        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
        
        processedFile = new File([finalBlob], file.name.replace(/\.heic?$/i, '.jpg'), {
          type: 'image/jpeg'
        })
        
        previewUrl = URL.createObjectURL(processedFile)
        
        console.log('✅ HEIC converted successfully:', {
          originalSize: file.size,
          convertedSize: processedFile.size,
          originalType: file.type,
          convertedType: processedFile.type
        })
        
        onLoading(false)
      } catch (error) {
        console.error('❌ HEIC conversion failed:', error)
        onLoading(false)
        onAnalysisComplete({ 
          error: `Failed to convert HEIC file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try converting to JPG first or use a different image.` 
        })
        return
      }
    } else {
      // Regular image file
      previewUrl = URL.createObjectURL(file)
    }

    console.log('Created preview URL:', previewUrl)
    setPreview(previewUrl)
    
    console.log('Sending file for analysis:', {
      name: processedFile.name,
      size: processedFile.size,
      type: processedFile.type
    })

    const formData = new FormData()
    formData.append('file', processedFile)

    onLoading(true)
    try {
      // Use local API route for Vercel deployment, fallback to backend for development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/analyze' 
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/analyze')
      
      console.log('Sending request to:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server response error:', errorText)
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('Analysis result:', result)
      
      if (result.error) {
        onAnalysisComplete({ error: result.error })
      } else {
        onAnalysisComplete(result)
      }
    } catch (error) {
      console.error('❌ Analysis failed:', error)
      onAnalysisComplete({ 
        error: `Analysis failed: ${error instanceof Error ? error.message : 'Network error'}. Please check your connection and try again.` 
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
          accept="image/*,.heic,.HEIC,.heif,.HEIF"
          onChange={handleFileSelect}
          className="upload-input"
          aria-label="Upload palm image"
        />
        
        <div className="upload-content">
          <div className="upload-icon">🤲</div>
          <h3>Upload Your Palm Photo</h3>
          <p>Drag & drop an image here, or click to choose a file</p>
          <div className="supported-formats">
            <small>✅ Supported: JPG, PNG, HEIC, HEIF, WebP, BMP</small>
          </div>
          <div className="upload-buttons">
            <button type="button" className="upload-button">
              📁 Choose File
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


    </div>
  )
}