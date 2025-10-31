import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Logo from './Logo'

export default function Layout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <Logo size="sm" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-navy-700 bg-clip-text text-transparent">
                  NODO+
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-navy-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-primary-200 mb-2">
              NODO+ es una solución desarrollada por
            </p>
            <a
              href="https://www.nogalesplus.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold text-lg hover:text-primary-300 transition-colors inline-flex items-center gap-2"
            >
              Nogales+
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="text-primary-200 text-sm mt-4">
              Transformando la educación en América Latina mediante la implementación estratégica de tecnologías educativas
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

