import { Routes, Route } from 'react-router-dom'
import Onboarding from './Onboarding'
import Questionnaire from './Questionnaire'
import SolutionsList from './SolutionsList'
import SolutionPreview from './SolutionPreview'

export default function EdTechDashboard() {
  return (
    <Routes>
      <Route path="onboarding" element={<Onboarding />} />
      <Route path="solutions" element={<SolutionsList />} />
      <Route path="solutions/:id/questionnaire" element={<Questionnaire />} />
      <Route path="solutions/:id/preview" element={<SolutionPreview />} />
    </Routes>
  )
}

