import { Routes, Route, Navigate } from 'react-router-dom'
import Institutions from './Institutions'
import InstitutionDetail from './InstitutionDetail'

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="institutions" element={<Institutions />} />
      <Route path="institutions/:id" element={<InstitutionDetail />} />
      <Route path="/" element={<Navigate to="/admin/institutions" replace />} />
    </Routes>
  )
}

