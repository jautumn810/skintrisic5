import SiteHeader from '../../components/SiteHeader'
import { useNavigate } from 'react-router-dom'

export default function AnalysisResultsPage() {
  const navigate = useNavigate()

  const handleSectionClick = (section) => {
    if (section === 'DEMOGRAPHICS') {
      navigate('/analysis/demographics')
    }
    // Add navigation for other sections when they're implemented
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader section="INTRO" />

      <div style={{ paddingTop: 160, maxWidth: 980, margin: "0 auto", paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.02em" }}>A.I. ANALYSIS</div>
        
        <div style={{ marginTop: 18, fontSize: 18, color: "rgba(0,0,0,0.75)", lineHeight: 1.5 }}>
          A.I. HAS ESTIMATED THE FOLLOWING.
        </div>
        <div style={{ marginTop: 8, fontSize: 18, color: "rgba(0,0,0,0.75)", lineHeight: 1.5 }}>
          FIX ESTIMATED INFORMATION IF NEEDED.
        </div>

        <div style={{ marginTop: 60, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="analysis-diamond-container">
            <div className="analysis-diamond-top" onClick={() => handleSectionClick('DEMOGRAPHICS')}>
              <span>DEMOGRAPHICS</span>
            </div>
            <div className="analysis-diamond-left" onClick={() => handleSectionClick('COSMETIC CONCERNS')}>
              <span>COSMETIC CONCERNS</span>
            </div>
            <div className="analysis-diamond-right" onClick={() => handleSectionClick('SKIN TYPE DETAILS')}>
              <span>SKIN TYPE DETAILS</span>
            </div>
            <div className="analysis-diamond-bottom" onClick={() => handleSectionClick('WEATHER')}>
              <span>WEATHER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
