'use client'

import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Link from 'next/link'

export default function ResultPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const cameraIconRef = useRef<HTMLDivElement>(null)
  const galleryIconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const imageInput = imageInputRef.current
    const cameraIcon = cameraIconRef.current
    const galleryIcon = galleryIconRef.current

    const handleImageUpload = async (file: File) => {
      if (file && file.type.startsWith('image/')) {
        // Read file for preview
        const reader = new FileReader()
        let imageDataUrl = ''
        reader.onload = (e) => {
          const result = e.target?.result as string
          imageDataUrl = result
          setImagePreview(result)
        }
        reader.readAsDataURL(file)

        // Phase 2: POST /api/analyze - Analyze image
        setIsAnalyzing(true)
        try {
          const userId = sessionStorage.getItem('userId')
          const formData = new FormData()
          formData.append('image', file)
          if (userId) {
            formData.append('userId', userId)
          }

          const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData,
          })

          const data = await response.json()

          if (response.ok && data.success) {
            setAnalysisData(data.data.analysis)
            // Store analysis data in sessionStorage for use in select page
            sessionStorage.setItem('analysisData', JSON.stringify(data.data.analysis))
            sessionStorage.setItem(
              'imagePreview',
              data.data.imagePreview || imageDataUrl
            )
          } else {
            console.error('Error analyzing image:', data.error)
            alert('Failed to analyze image. Please try again.')
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('An error occurred while analyzing the image. Please try again.')
        } finally {
          setIsAnalyzing(false)
        }
      }
    }

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        handleImageUpload(target.files[0])
      }
    }

    const handleCameraClick = async () => {
      // Phase 3: Take a selfie using camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }, // Front-facing camera for selfie
        })

        // Create video element to show camera preview
        const video = document.createElement('video')
        video.srcObject = stream
        video.autoplay = true
        video.style.position = 'fixed'
        video.style.top = '0'
        video.style.left = '0'
        video.style.width = '100%'
        video.style.height = '100%'
        video.style.zIndex = '9999'
        video.style.objectFit = 'cover'
        document.body.appendChild(video)

        // Create capture button
        const captureButton = document.createElement('button')
        captureButton.textContent = 'Capture'
        captureButton.style.position = 'fixed'
        captureButton.style.bottom = '50px'
        captureButton.style.left = '50%'
        captureButton.style.transform = 'translateX(-50%)'
        captureButton.style.zIndex = '10000'
        captureButton.style.padding = '15px 30px'
        captureButton.style.backgroundColor = '#1A1B1C'
        captureButton.style.color = 'white'
        captureButton.style.border = 'none'
        captureButton.style.borderRadius = '5px'
        captureButton.style.cursor = 'pointer'
        document.body.appendChild(captureButton)

        // Create cancel button
        const cancelButton = document.createElement('button')
        cancelButton.textContent = 'Cancel'
        cancelButton.style.position = 'fixed'
        cancelButton.style.bottom = '50px'
        cancelButton.style.left = 'calc(50% + 100px)'
        cancelButton.style.transform = 'translateX(-50%)'
        cancelButton.style.zIndex = '10000'
        cancelButton.style.padding = '15px 30px'
        cancelButton.style.backgroundColor = '#666'
        cancelButton.style.color = 'white'
        cancelButton.style.border = 'none'
        cancelButton.style.borderRadius = '5px'
        cancelButton.style.cursor = 'pointer'
        document.body.appendChild(cancelButton)

        // Handle capture
        captureButton.onclick = () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0)
            canvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
                handleImageUpload(file)
              }
            }, 'image/jpeg', 0.95)

            // Cleanup
            stream.getTracks().forEach((track) => track.stop())
            document.body.removeChild(video)
            document.body.removeChild(captureButton)
            document.body.removeChild(cancelButton)
          }
        }

        // Handle cancel
        cancelButton.onclick = () => {
          stream.getTracks().forEach((track) => track.stop())
          document.body.removeChild(video)
          document.body.removeChild(captureButton)
          document.body.removeChild(cancelButton)
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        // Fallback to file input if camera access fails
        imageInput?.click()
      }
    }

    const handleGalleryClick = () => {
      imageInput?.click()
    }

    if (imageInput) {
      imageInput.addEventListener('change', handleFileChange)
    }

    if (cameraIcon) {
      cameraIcon.addEventListener('click', handleCameraClick)
    }

    if (galleryIcon) {
      galleryIcon.addEventListener('click', handleGalleryClick)
    }

    return () => {
      if (imageInput) {
        imageInput.removeEventListener('change', handleFileChange)
      }
      if (cameraIcon) {
        cameraIcon.removeEventListener('click', handleCameraClick)
      }
      if (galleryIcon) {
        galleryIcon.removeEventListener('click', handleGalleryClick)
      }
    }
  }, [])

  return (
    <>
      <Header />
      <div className="min-h-[92vh] flex flex-col bg-white relative md:pt-[64px] justify-center">
        {/* Rotating dotted geometric pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.15] animate-pattern-rotate"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(160, 164, 171, 0.3) 15px, rgba(160, 164, 171, 0.3) 16px),
              repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(160, 164, 171, 0.3) 15px, rgba(160, 164, 171, 0.3) 16px)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: 'center',
            transformOrigin: 'center center',
          }}
        />
        
        <div className="absolute top-2 left-9 md:left-8 text-left z-10">
          <p className="font-semibold text-xs md:text-sm">TO START ANALYSIS</p>
        </div>
        
        {/* Main content - vertically stacked */}
        <div className="flex flex-col items-center justify-center relative z-10 space-y-16 md:space-y-20 py-20">
          {/* Camera/Face Scan Section */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Rotating dotted square frame */}
            <div 
              className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-dotted border-[#A0A4AB] animate-pattern-rotate"
              style={{
                transformOrigin: 'center center',
              }}
            />
            {/* Camera lens icon centered in frame */}
            <div 
              ref={cameraIconRef}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <div className="w-[100px] h-[100px] md:w-[136px] md:h-[136px] flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <svg width="136" height="136" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A1B1C]">
                  {/* Outer lens ring */}
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  {/* Middle lens ring */}
                  <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  {/* Inner lens aperture */}
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
                  {/* Center dot */}
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                  {/* Lens segments/iris blades */}
                  <line x1="12" y1="2" x2="12" y2="8" stroke="currentColor" strokeWidth="1"/>
                  <line x1="12" y1="16" x2="12" y2="22" stroke="currentColor" strokeWidth="1"/>
                  <line x1="2" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1"/>
                  <line x1="16" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
            </div>
            {/* Text below icon */}
            <div className="mt-6 text-center">
              <p className="text-xs md:text-sm font-normal leading-[24px]">
                ALLOW A.I.
                <br />
                TO SCAN YOUR FACE
              </p>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Rotating dotted square frame */}
            <div 
              className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-dotted border-[#A0A4AB] animate-pattern-rotate"
              style={{
                transformOrigin: 'center center',
              }}
            />
            {/* Gallery icon centered in frame */}
            <div 
              ref={galleryIconRef}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <div className="w-[100px] h-[100px] md:w-[136px] md:h-[136px] flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <svg width="136" height="136" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1A1B1C]">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            </div>
            {/* Text below icon */}
            <div className="mt-6 text-center">
              <p className="text-xs md:text-sm font-normal leading-[24px]">
                ALLOW A.I.
                <br />
                ACCESS GALLERY
              </p>
            </div>
          </div>
        </div>

        {/* Preview section - top right */}
        <div className="absolute top-[-75px] right-7 md:top-[-50px] md:right-8 transition-opacity duration-300 opacity-100 z-10">
          <h1 className="text-xs md:text-sm font-normal mb-1">Preview</h1>
          <div
            className="w-24 h-24 md:w-32 md:h-32 border border-gray-300 overflow-hidden relative"
            style={{
              backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-xs">Analyzing...</div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          id="image-input"
        />

        {/* Bottom navigation */}
        <div className="pt-4 md:pt-0 pb-8 bg-white sticky md:static bottom-30.5 mb-0 md:mb-0 z-10">
          <div className="absolute bottom-8 w-full flex justify-between md:px-9 px-13">
            <BackButton href="/thank-you" />
            {imagePreview && (
              <Link href="/select" id="proceed-link">
                <div>
                  <div className="w-12 h-12 flex items-center justify-center border border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                    <span className="rotate-[-45deg] text-xs font-semibold sm:hidden">
                      PROCEED
                    </span>
                  </div>
                  <div className="group hidden sm:flex flex-row relative justify-center items-center">
                    <span className="text-sm font-semibold hidden sm:block mr-5">
                      PROCEED
                    </span>
                    <div className="w-12 h-12 hidden sm:flex justify-center border border-[#1A1B1C] rotate-45 scale-[0.85] group-hover:scale-[0.92] ease duration-300"></div>
                    <span className="absolute right-[15px] bottom-[13px] scale-[0.9] hidden sm:block group-hover:scale-[0.92] ease duration-300">
                      ▶
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
