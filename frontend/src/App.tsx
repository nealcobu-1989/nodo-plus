import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import EdTechDashboard from './pages/edtech/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import Catalog from './pages/catalog/Catalog'
import InstitutionQuestionnaire from './pages/institution/Questionnaire'

// Componente para proteger rutas y guardar la ruta original
function ProtectedRoute({ children, requiredRole }: { children: JSX.Element; requiredRole?: string | string[] }) {
  const { user } = useAuthStore()
  const location = useLocation()
  
  const hasAccess = requiredRole 
    ? Array.isArray(requiredRole) 
      ? requiredRole.includes(user?.role || '') 
      : user?.role === requiredRole
    : !!user

  if (!hasAccess) {
    // Guardar la ruta original en el state para redirigir después del login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }

  return children
}

function App() {
  const { user } = useAuthStore()
  
  console.log('App rendered, user:', user)

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page sin Layout */}
        <Route path="/" element={<Landing />} />
        
        {/* Rutas con Layout */}
        <Route element={<Layout />}>
          {/* Rutas públicas */}
          <Route path="login" element={<Login />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="institution/questionnaire" element={<InstitutionQuestionnaire />} />
          
          {/* Rutas protegidas EdTech */}
          <Route 
            path="edtech/*" 
            element={
              <ProtectedRoute requiredRole={['EDTECH', 'ADMIN']}>
                <EdTechDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas protegidas Admin */}
          <Route 
            path="admin/*" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

