import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Building, Mail, MapPin, ArrowLeft, Calendar, CheckCircle, ExternalLink } from 'lucide-react'
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
    website?: string
    registeredDate?: string
    interest?: string
    [key: string]: any
  }
  user: {
    email: string
    createdAt: string
  }
  createdAt: string
  updatedAt: string
  approvedAt?: string
}

export default function InstitutionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadInstitution()
    }
  }, [id])

  const loadInstitution = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/admin/institutions/${id}`)
      setInstitution(response.data)
    } catch (error: any) {
      console.error('Error loading institution:', error)
      alert(`Error al cargar institución: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Cargando información...</div>
      </div>
    )
  }

  if (!institution) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">Institución no encontrada.</p>
          <button
            onClick={() => navigate('/admin/institutions')}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Volver al listado
          </button>
        </div>
      </div>
    )
  }

  const contactEmail = institution.characterizationData?.contactEmail || institution.user.email
  const website = institution.characterizationData?.website

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/admin/institutions')}
        className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al listado
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start gap-6 mb-8">
          <InitialLogo name={institution.name} size="lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-navy-800 mb-2">{institution.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="capitalize px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {institution.type}
              </span>
              {institution.rural && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Zona Rural
                </span>
              )}
              {institution.status === 'APPROVED' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Aprobada
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Ubicación</span>
            </div>
            <p className="text-gray-800">{institution.location}</p>
          </div>

          {website && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <ExternalLink className="w-5 h-5" />
                <span className="font-medium">Sitio Web</span>
              </div>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1"
              >
                Visitar sitio web
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email de Contacto</span>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {contactEmail}
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email de Usuario</span>
            </div>
            <a
              href={`mailto:${institution.user.email}`}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {institution.user.email}
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Fecha de Registro</span>
            </div>
            <p className="text-gray-800">
              {new Date(institution.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {institution.characterizationData?.interest && (
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-navy-800 mb-3">Interés</h3>
            <p className="text-gray-700 leading-relaxed">
              {institution.characterizationData.interest}
            </p>
          </div>
        )}

        {Object.keys(institution.characterizationData || {}).length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold text-navy-800 mb-3">Datos Adicionales</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(institution.characterizationData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

