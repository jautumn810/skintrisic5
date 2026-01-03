import SiteHeader from '../../components/SiteHeader'
import { DiamondButton } from '../../components/DiamondNav'
import BlinkingInput from '../../components/BlinkingInput'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isValidLettersOnly } from '../../lib/validators'
import { loadUser, saveUser } from '../../lib/storage'
import { postPhaseOne } from '../../lib/api'

export default function CityPage() {
  console.log('✅ CityPage component rendering');
  const navigate = useNavigate()
  const [city, setCity] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('✅ CityPage useEffect running');
    const u = loadUser()
    if (u?.location) setCity(u.location)
    
    // Debug: Check if buttons have small class and CSS rules
    const debugButtons = () => {
      console.log('%c=== CITY PAGE BUTTON DEBUG ===', 'color: blue; font-size: 16px; font-weight: bold;');
      const buttons = document.querySelectorAll('.back-fixed .diamond-btn, .right-fixed .diamond-btn');
      console.log(`Found ${buttons.length} buttons`);
      
      if (buttons.length === 0) {
        console.warn('⚠️ No buttons found! Make sure you are on the city page.');
        return;
      }
      
      buttons.forEach((btn, index) => {
        const computedStyle = window.getComputedStyle(btn);
        const windowWidth = window.innerWidth;
        const isMobile = windowWidth <= 768;
        console.log(`%c--- Button ${index + 1} ---`, 'color: green; font-weight: bold;');
        console.log('className:', btn.className);
        console.log('classList:', Array.from(btn.classList));
        console.log('has "diamond-btn-small" class:', btn.classList.contains('diamond-btn-small'));
        console.log('has "diamond-btn" class:', btn.classList.contains('diamond-btn'));
        console.log('Computed width:', computedStyle.width);
        console.log('Computed height:', computedStyle.height);
        console.log('Window width:', windowWidth, 'px');
        console.log('Is mobile (≤768px):', isMobile);
        console.log('Expected width:', isMobile ? '70px' : '80px');
        console.log('Expected height:', isMobile ? '70px' : '80px');
        const expectedWidth = isMobile ? '70px' : '80px';
        const actualWidth = computedStyle.width;
        console.log('✅ CSS Match:', actualWidth === expectedWidth ? 'CORRECT ✓' : `❌ WRONG - Expected ${expectedWidth}, got ${actualWidth}`);
        
        // Check which CSS rule is being applied
        const stylesheets = Array.from(document.styleSheets);
        stylesheets.forEach((sheet, sheetIndex) => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach((rule) => {
              if (rule.selectorText && rule.selectorText.includes('diamond-btn-small') && rule.media && rule.media.mediaText.includes('max-width: 768px')) {
                console.log('📱 Mobile media query rule found:', rule.cssText);
              }
            });
          } catch (e) {
            // Cross-origin stylesheets will throw errors
          }
        });
      });
      console.log('%c=== END DEBUG ===', 'color: blue; font-size: 16px; font-weight: bold;');
    };
    
    // Run immediately and after a delay
    setTimeout(debugButtons, 100);
    
    // Also run on window resize to check mobile styles
    window.addEventListener('resize', debugButtons);
    return () => window.removeEventListener('resize', debugButtons);
  }, [])

  async function onProceed() {
    if (!isValidLettersOnly(city)) {
      setError("Enter a valid city (letters only).")
      return
    }

    const u = loadUser()
    const name = (u?.name ?? "").trim()
    const location = city.trim()

    if (!isValidLettersOnly(name)) {
      setError("Name is missing/invalid. Go back and enter your name.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      saveUser({ name, location })
      await postPhaseOne({ name, location })
      navigate("/analysis/permissions")
    } catch (e) {
      setError(e?.message ?? "Failed to submit Phase 1 API.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="input-page city-page">
      <SiteHeader section="INTRO" />
      <div className="input-top city-input-top">TO START ANALYSIS</div>

      <BlinkingInput
        value={city}
        onChange={(v) => { setCity(v); if (error) setError(null); }}
        placeholder="your city name"
      />

      <div className="underline" />

      {error && (
        <div style={{ maxWidth: 980, margin: "14px auto 0", padding: "0 28px", color: "#b00020", fontWeight: 800 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 980, margin: '40px auto 0', padding: '0 28px', gap: '20px' }}>
        <DiamondButton label="BACK" variant="white" onClick={() => navigate(-1)} className="diamond-btn-small" />
        <DiamondButton label={loading ? "..." : "PROCEED"} variant="black" onClick={() => { if (!loading) onProceed(); }} className="diamond-btn-small" />
      </div>
    </div>
  )
}

