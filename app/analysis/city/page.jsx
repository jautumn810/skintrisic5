'use client'

import SiteHeader from '../../../components/SiteHeader'
import { DiamondButton } from '../../../components/DiamondNav'
import BlinkingInput from '../../../components/BlinkingInput'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isValidLettersOnly } from '../../../lib/validators'
import { loadUser, saveUser } from '../../../lib/storage'
import { postPhaseOne } from '../../../lib/api'

export default function CityPage() {
  const router = useRouter()
  const [city, setCity] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const u = loadUser()
    if (u?.location) setCity(u.location)
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
      router.push("/analysis/permissions")
    } catch (e) {
      setError(e?.message ?? "Failed to submit Phase 1 API.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="input-page">
      <SiteHeader section="INTRO" />
      <div className="input-top">TO START ANALYSIS</div>

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

      <div className="back-fixed">
        <DiamondButton label="BACK" variant="white" onClick={() => router.back()} className="small" />
      </div>

      <div className="right-fixed">
        <DiamondButton label={loading ? "..." : "PROCEED"} variant="black" onClick={() => { if (!loading) onProceed(); }} className="small" />
      </div>
    </div>
  )
}

