import { Routes, Route, Navigate } from 'react-router-dom'
import Institutions from './Institutions'
import InstitutionDetail from './InstitutionDetail'
import SubmissionsList from './SubmissionsList'
import SubmissionView from './SubmissionView'
import SubmissionEdit from './SubmissionEdit'

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="institutions" element={<Institutions />} />
      <Route path="institutions/:id" element={<InstitutionDetail />} />
      <Route path="submissions" element={<SubmissionsList />} />
      <Route path="submissions/:id/view" element={<SubmissionView />} />
      <Route path="submissions/:id/edit" element={<SubmissionEdit />} />
      <Route path="/" element={<Navigate to="/admin/submissions" replace />} />
    </Routes>
  )
}

