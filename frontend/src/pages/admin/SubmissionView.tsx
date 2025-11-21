import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Loader2, AlertCircle, Building, School } from 'lucide-react'

type Submission = {
  id: string
  status: string
  answers: Record<string, any>
  summaryText: string | null
  summarySnapshot: any
  consentData: Record<string, boolean> | null
  submittedAt: string | null
  createdAt: string
  user: {
    email: string
    role: string
  } | null
  edtechCompany: {
    name: string
  } | null
  institution: {
    name: string
  } | null
  solution: {
    name: string
  } | null
}

export default function SubmissionView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadSubmission()
    }
  }, [id])

  async function loadSubmission() {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`/api/admin/submissions/${id}`)
      setSubmission(response.data)
    } catch (err: any) {
      console.error('Error loading submission:', err)
      setError('No se pudo cargar el formulario.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error || 'Formulario no encontrado'}</p>
        </div>
        <button
          onClick={() => navigate('/admin/submissions')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Volver a la lista
        </button>
      </div>
    )
  }

  const submissionType = submission.edtechCompany ? 'EdTech' : 'Colegio'
  const submissionName = submission.edtechCompany?.name || submission.institution?.name || 'Sin nombre'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin/submissions')}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a la lista
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            {submission.edtechCompany ? (
              <Building className="w-8 h-8 text-green-600" />
            ) : (
              <School className="w-8 h-8 text-blue-600" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-navy-800">{submissionName}</h1>
              <p className="text-gray-600">{submissionType}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>{' '}
              <span className="font-medium">{submission.user?.email || '-'}</span>
            </div>
            <div>
              <span className="text-gray-500">Estado:</span>{' '}
              <span className="font-medium">{submission.status}</span>
            </div>
            {submission.solution && (
              <div>
                <span className="text-gray-500">Solución:</span>{' '}
                <span className="font-medium">{submission.solution.name}</span>
              </div>
            )}
            {submission.submittedAt && (
              <div>
                <span className="text-gray-500">Enviado:</span>{' '}
                <span className="font-medium">
                  {new Date(submission.submittedAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {submission.summaryText ? (
          <div>
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">Resumen del Formulario</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-6 rounded-lg border">
                {submission.summaryText}
              </pre>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-navy-800 mb-4">Respuestas</h2>
            <div className="space-y-4">
              {Object.keys(submission.answers).length === 0 ? (
                <p className="text-gray-500">No hay respuestas registradas.</p>
              ) : (
                <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-6 rounded-lg border overflow-auto">
                  {JSON.stringify(submission.answers, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {submission.consentData && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-navy-800 mb-3">Consentimientos</h3>
            <div className="space-y-2">
              {Object.entries(submission.consentData).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!value}
                    disabled
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-gray-700">{key}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t flex gap-3">
          <button
            onClick={() => navigate(`/admin/submissions/${id}/edit`)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Modificar Formulario
          </button>
        </div>
      </div>
    </div>
  )
}

