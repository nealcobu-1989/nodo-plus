import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Save, X, Loader2, AlertCircle, Building, School } from 'lucide-react'

type Submission = {
  id: string
  status: string
  answers: Record<string, any>
  summaryText: string | null
  summarySnapshot: any
  consentData: Record<string, boolean> | null
  sectionProgress: any
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

export default function SubmissionEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [editedData, setEditedData] = useState<{
    answers?: Record<string, any>
    summaryText?: string | null
    consentData?: Record<string, boolean> | null
    sectionProgress?: any
  }>({})

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
      setEditedData({
        answers: response.data.answers,
        summaryText: response.data.summaryText,
        consentData: response.data.consentData,
        sectionProgress: response.data.sectionProgress
      })
    } catch (err: any) {
      console.error('Error loading submission:', err)
      setError('No se pudo cargar el formulario.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!submission || !hasChanges) return

    try {
      setSaving(true)
      setError(null)
      await axios.put(`/api/admin/submissions/${id}`, {
        answers: editedData.answers,
        summaryText: editedData.summaryText,
        consentData: editedData.consentData,
        sectionProgress: editedData.sectionProgress
      })
      setHasChanges(false)
      alert('Cambios guardados exitosamente.')
      navigate(`/admin/submissions/${id}/view`)
    } catch (err: any) {
      console.error('Error saving submission:', err)
      setError('No se pudieron guardar los cambios. Inténtalo nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (hasChanges) {
      if (!confirm('¿Estás seguro de que quieres salir sin guardar los cambios?')) {
        return
      }
    }
    navigate(`/admin/submissions/${id}/view`)
  }

  function updateField(field: string, value: any) {
    setEditedData((prev) => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
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
        onClick={handleCancel}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        {hasChanges ? 'Cancelar y volver' : 'Volver'}
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
              <h1 className="text-3xl font-bold text-navy-800">Modificar: {submissionName}</h1>
              <p className="text-gray-600">{submissionType}</p>
            </div>
          </div>
          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              Tienes cambios sin guardar
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen del Formulario
            </label>
            <textarea
              value={editedData.summaryText || ''}
              onChange={(e) => updateField('summaryText', e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Resumen del formulario..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Respuestas (JSON)
            </label>
            <textarea
              value={JSON.stringify(editedData.answers || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  updateField('answers', parsed)
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">
              Edita el JSON directamente. Asegúrate de que sea válido.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <X className="w-4 h-4 inline mr-2" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

