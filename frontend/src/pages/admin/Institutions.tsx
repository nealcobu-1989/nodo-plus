import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Building, Mail, MapPin, ArrowRight } from 'lucide-react'
import InitialLogo from '../../components/InitialLogo'

interface Institution {
  id: string
  name: string
  type: string
  location: string
  rural: boolean
  status: string
  characterizationData: {
    contactEmail?: string
    [key: string]: any
  }
  user: {
    email: string
    createdAt: string
  }
  createdAt: string
}

export default function Institutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadInstitutions()
  }, [])

  const loadInstitutions = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/institutions')
      setInstitutions(response.data.institutions || [])
    } catch (error: any) {
      console.error('Error loading institutions:', error)
      alert(`Error al cargar instituciones: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Cargando instituciones...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Instituciones Educativas</h1>
        <p className="text-gray-600">Catálogo de instituciones registradas en NODO+</p>
      </div>

      {institutions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">No se encontraron instituciones educativas.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((institution) => (
            <div
              key={institution.id}
              onClick={() => navigate(`/admin/institutions/${institution.id}`)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <InitialLogo name={institution.name} size="md" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-navy-800 mb-1">{institution.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{institution.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Building className="w-4 h-4" />
                  <span className="capitalize">{institution.type}</span>
                  {institution.rural && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Rural
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{institution.user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-primary-600 text-sm font-medium mt-4">
                Ver detalles
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

