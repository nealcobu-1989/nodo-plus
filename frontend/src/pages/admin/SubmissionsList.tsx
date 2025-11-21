import { useEffect, useState } from 'react'
import axios from 'axios'
import { Eye, Edit, Trash2, Building, School, Loader2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Submission = {
  id: string
  status: string
  submittedAt: string | null
  createdAt: string
  updatedAt: string
  user: {
    email: string
    role: string
  } | null
  edtechCompany: {
    name: string
    userId: string
  } | null
  institution: {
    name: string
    userId: string
  } | null
  solution: {
    name: string
  } | null
}

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadSubmissions()
  }, [])

  async function loadSubmissions() {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/api/admin/submissions')
      setSubmissions(response.data)
    } catch (err: any) {
      console.error('Error loading submissions:', err)
      setError('No se pudieron cargar los formularios. Inténtalo nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleArchive(id: string) {
    try {
      await axios.delete(`/api/admin/submissions/${id}`)
      setDeleteConfirm(null)
      loadSubmissions()
    } catch (err: any) {
      console.error('Error archiving submission:', err)
      alert('No se pudo archivar el formulario. Inténtalo nuevamente.')
    }
  }

  function getSubmissionType(submission: Submission): string {
    if (submission.edtechCompany) return 'EdTech'
    if (submission.institution) return 'Colegio'
    return 'Desconocido'
  }

  function getSubmissionName(submission: Submission): string {
    if (submission.edtechCompany) return submission.edtechCompany.name
    if (submission.institution) return submission.institution.name
    return submission.user?.email || 'Sin nombre'
  }

  function getStatusBadge(status: string) {
    const statusMap: Record<string, { label: string; color: string }> = {
      IN_PROGRESS: { label: 'En progreso', color: 'bg-yellow-100 text-yellow-800' },
      SUBMITTED: { label: 'Enviado', color: 'bg-green-100 text-green-800' },
      ARCHIVED: { label: 'Archivado', color: 'bg-gray-100 text-gray-800' }
    }
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Formularios Diligenciados</h1>
        <p className="text-gray-600">Gestiona los formularios de EdTechs y Colegios</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No hay formularios diligenciados aún.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de envío
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {submission.edtechCompany ? (
                          <Building className="w-5 h-5 text-green-600" />
                        ) : (
                          <School className="w-5 h-5 text-blue-600" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {getSubmissionType(submission)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getSubmissionName(submission)}
                      </div>
                      {submission.solution && (
                        <div className="text-sm text-gray-500">
                          Solución: {submission.solution.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{submission.user?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleDateString('es-CO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/submissions/${submission.id}/view`)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Ver formulario"
                        >
                          <Eye className="w-4 h-4" />
                          Acceder
                        </button>
                        <button
                          onClick={() => navigate(`/admin/submissions/${submission.id}/edit`)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="Modificar formulario"
                        >
                          <Edit className="w-4 h-4" />
                          Modificar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(submission.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="Archivar formulario"
                        >
                          <Trash2 className="w-4 h-4" />
                          Archivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmación de archivo */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Archivar formulario?
            </h3>
            <p className="text-gray-600 mb-6">
              El formulario será movido al archivo. Esta acción no se puede deshacer fácilmente.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleArchive(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Archivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

