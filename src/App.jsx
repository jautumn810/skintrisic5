import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TestingPage from './pages/TestingPage'
import IntroducePage from './pages/analysis/IntroducePage'
import PermissionsPage from './pages/analysis/PermissionsPage'
import ImagePage from './pages/analysis/ImagePage'
import SelfiePage from './pages/analysis/SelfiePage'
import ProcessingPage from './pages/analysis/ProcessingPage'
import AnalysisResultsPage from './pages/analysis/AnalysisResultsPage'
import DemographicsPage from './pages/analysis/DemographicsPage'
import CityPage from './pages/analysis/CityPage'
import SummaryPage from './pages/SummaryPage'
import './globals.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/testing" element={<TestingPage />} />
        <Route path="/analysis/introduce" element={<IntroducePage />} />
        <Route path="/analysis/permissions" element={<PermissionsPage />} />
        <Route path="/analysis/image" element={<ImagePage />} />
        <Route path="/analysis/selfie" element={<SelfiePage />} />
        <Route path="/analysis/processing" element={<ProcessingPage />} />
        <Route path="/analysis/results" element={<AnalysisResultsPage />} />
        <Route path="/analysis/demographics" element={<DemographicsPage />} />
        <Route path="/analysis/city" element={<CityPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </Router>
  )
}

export default App
