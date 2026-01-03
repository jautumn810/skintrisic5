import SiteHeader from '../../components/SiteHeader'
import { DiamondButton } from '../../components/DiamondNav'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { fileToBase64, postPhaseTwo } from '../../lib/api'
import { saveAI, saveImageBase64 } from '../../lib/storage'

export default function PermissionsPage() {
  const navigate = useNavigate()
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleCameraClick = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        // Stop the stream immediately as we're just requesting permission
        stream.getTracks().forEach(track => track.stop())
        console.log('Camera permission granted')
        // Navigate to selfie page
        navigate("/analysis/selfie")
      }
    } catch (error) {
      console.log('Camera permission denied or error:', error)
    }
  }

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setLoading(true)
    
    try {
      // Show preview
      const b64 = await fileToBase64(file)
      setPreviewImage(b64)
      saveImageBase64(b64)
      
      // Show alert when image appears in preview
      alert("Image analyzed successfully")
      
      // Navigate to image page which will handle the upload and analysis
      // Store the file data temporarily so image page can process it
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('pendingImageFile', b64)
      }
      
      // Navigate to image upload page which handles processing and auto-routes to demographics
      navigate("/analysis/image")
    } catch (error) {
      console.error('Error reading file:', error)
      setLoading(false)
      alert(`Failed to read image: ${error.message}. Please try again.`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader section="INTRO" />

      <div className="ai-wrap">
        <div className="ai-top-row">
          <div className="ai-start-title">TO START ANALYSIS</div>
          <div className="ai-preview">
            <div className="ai-preview-label">Preview</div>
            <div className="ai-preview-box">
              {previewImage && (
                <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="ai-blocks-container">
          <div className="ai-block" onClick={handleCameraClick} style={{ cursor: 'pointer' }}>
            <div className="ai-block-inner">
              <img src="/icons/camera-aperture.png" alt="camera" width={180} height={180} className="ai-icon" />
              <div className="ai-label-top">ALLOW A.I.</div>
              <div className="ai-label-bottom">TO SCAN YOUR FACE</div>
            </div>
          </div>

          <div className="ai-block" onClick={handleGalleryClick} style={{ cursor: 'pointer' }}>
            <div className="ai-block-inner">
              <img src="/icons/icon-gallery.svg" alt="gallery" width={180} height={180} className="ai-icon" />
              <div className="ai-label-top">ALLOW A.I.</div>
              <div className="ai-label-bottom">ACCESS GALLERY</div>
            </div>
          </div>
        </div>
      </div>

      <div className="back-fixed">
        <DiamondButton label="BACK" variant="white" onClick={() => navigate(-1)} className="diamond-btn-small" />
      </div>

      <div className="right-fixed">
        <DiamondButton label="PROCEED" variant="black" onClick={() => navigate("/analysis/image")} className="diamond-btn-small" />
      </div>
    </div>
  )
}

