import SiteHeader from '../../components/SiteHeader'
import { DiamondButton } from '../../components/DiamondNav'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { postPhaseTwo } from '../../lib/api'
import { saveAI, saveImageBase64 } from '../../lib/storage'

export default function SelfiePage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let stream = null

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        setError(e?.message ?? "Camera permission denied or unavailable.")
      }
    }

    start()

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  async function captureAndAnalyze() {
    if (!videoRef.current || !canvasRef.current) {
      setError("Video or canvas not ready. Please wait for camera to load.")
      return
    }
    
    setError(null)
    setLoading(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Check if video is ready
      if (!video.videoWidth || !video.videoHeight) {
        throw new Error("Video stream not ready. Please wait for camera to initialize.")
      }
      
      const w = video.videoWidth
      const h = video.videoHeight
      console.log('Video dimensions:', w, 'x', h)
      
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas not supported.")
      
      ctx.drawImage(video, 0, 0, w, h)

      const dataURL = canvas.toDataURL("image/png")
      console.log('Captured image data URL length:', dataURL?.length)
      console.log('Data URL prefix:', dataURL?.substring(0, 50))
      
      if (!dataURL || typeof dataURL !== 'string' || dataURL.length < 100) {
        throw new Error("Failed to capture image from canvas. Image data is invalid.")
      }
      
      saveImageBase64(dataURL)

      console.log('Sending image to API, data URL length:', dataURL.length)
      
      // Send the full data URL - the API expects this format (same as fileToBase64 returns)
      const json = await postPhaseTwo({ Image: dataURL })
      console.log('Phase 2 API response:', json)
      saveAI(json)
      alert("Image analyzed successfully")
      navigate("/analysis/processing")
    } catch (e) {
      console.error('Capture error:', e)
      setError(e?.message ?? "Failed to capture selfie.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader section="INTRO" />

      <div style={{ paddingTop: 160, maxWidth: 980, margin: "0 auto", paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.06em" }}>TAKE A SELFIE</div>

        <div style={{ marginTop: 22, background: "#efefef", padding: 18, border: "2px solid rgba(0,0,0,0.12)" }}>
          <video ref={videoRef} playsInline style={{ width: "100%", maxHeight: 520, background: "#111" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <button
          type="button"
          onClick={captureAndAnalyze}
          disabled={loading}
          style={{ marginTop: 16, padding: "12px 18px", background: "#111", color: "#fff", border: "none", fontWeight: 900, letterSpacing: "0.06em", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "CAPTURING..." : "CAPTURE & ANALYZE"}
        </button>

        {error && (
          <div style={{ marginTop: 16, color: "#b00020", fontWeight: 800 }}>{error}</div>
        )}
      </div>

      <div className="back-fixed">
        <DiamondButton label="BACK" variant="white" onClick={() => navigate(-1)} />
      </div>
    </div>
  )
}

