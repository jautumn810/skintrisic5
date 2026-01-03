import SiteHeader from '../../components/SiteHeader'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProcessingPage() {
  const navigate = useNavigate()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Navigate to demographics page after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/analysis/demographics')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader section="INTRO" />

      <div style={{ 
        paddingTop: 160, 
        maxWidth: 980, 
        margin: "0 auto", 
        paddingLeft: 28, 
        paddingRight: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 160px)"
      }}>
        <div style={{ 
          fontSize: 28, 
          fontWeight: 900, 
          letterSpacing: "0.02em",
          textAlign: "center"
        }}>
          PROCESSING ANALYSIS
        </div>
        
        <div style={{ 
          marginTop: 24,
          fontSize: 24,
          fontWeight: 400,
          letterSpacing: "0.02em",
          color: "rgba(0,0,0,0.65)",
          minHeight: "32px"
        }}>
          {dots}
        </div>
      </div>
    </div>
  )
}

