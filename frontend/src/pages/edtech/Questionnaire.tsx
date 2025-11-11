import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle, ChevronRight } from 'lucide-react'
import {
  profileSurvey,
  Question,
  SurveySection,
  ChoiceOption,
} from '../../config/profileSurvey'

type ConsentState = Record<string, boolean>

type FileInfo = {
  name: string
  size: number
  type?: string
  attachmentId?: string
}

type TextAnswer = { kind: 'text'; value: string }
type UrlAnswer = { kind: 'url'; value: string }
type SingleChoiceAnswer = { kind: 'single'; value: string | null; otherText?: string }
type MultiChoiceAnswer = { kind: 'multi'; values: string[]; otherText?: string }
type FileAnswer = { kind: 'file'; files: FileInfo[] }

type AnswerValue =
  | TextAnswer
  | UrlAnswer
  | SingleChoiceAnswer
  | MultiChoiceAnswer
  | FileAnswer

type AnswersState = Record<string, AnswerValue>

type SectionProgressEntry = {
  completed: boolean
  completedAt?: string
}

type SectionProgressState = Record<string, SectionProgressEntry>

type SummarySnapshot = Array<{
  id: string
  title: string
  questions: Array<{
    id: string
    prompt: string
    response: string
  }>
}>

type AttachmentRecord = {
  id: string
  questionId: string
  filename: string
  fileUrl: string
  contentType: string | null
  sizeBytes: number | null
  storageProvider: string | null
  uploadedAt: string
  downloadUrl?: string
}

const steps = [
  { id: 'intro', title: 'Introducción' },
  ...profileSurvey.sections.map((section) => ({
    id: section.id,
    title: section.title,
  })),
  { id: 'summary', title: 'Resumen' },
  { id: 'submitted', title: 'Formulario Enviado' },
]

const FORM_STEPS_COUNT = steps.length - 2 // Exclude summary and submitted for progress

function getGlobalQuestionNumber(sectionId: string, questionIndex: number): number {
  let globalNumber = 0
  for (const section of profileSurvey.sections) {
    if (section.id === sectionId) {
      return globalNumber + questionIndex + 1
    }
    globalNumber += section.questions.length
  }
  return globalNumber + questionIndex + 1
}

const REQUIRED_STATUS = 'SUBMITTED'

function initialConsentState(): ConsentState {
  return profileSurvey.intro.consent.reduce<ConsentState>((acc, item) => {
    acc[item.id] = false
    return acc
  }, {} as ConsentState)
}

function isQuestionVisible(question: Question, answers: AnswersState): boolean {
  if (!question.dependsOn) {
    return true
  }

  const dependencyAnswer = answers[question.dependsOn.questionId]
  if (!dependencyAnswer) {
    return false
  }

  const expected = question.dependsOn.expectedAnswers

  switch (dependencyAnswer.kind) {
    case 'single':
      return dependencyAnswer.value
        ? expected.includes(dependencyAnswer.value)
        : false
    case 'multi':
      return dependencyAnswer.values.some((value) => expected.includes(value))
    default:
      return false
  }
}

function wordCount(value: string): number {
  return value.trim() ? value.trim().split(/\s+/).length : 0
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, index)
  return `${size.toFixed(size > 10 ? 0 : 1)} ${units[index]}`
}

function buildSummarySnapshot(
  answers: AnswersState,
): SummarySnapshot {
  return profileSurvey.sections.map((section) => ({
    id: section.id,
    title: section.title,
    questions: section.questions
      .filter((question) => isQuestionVisible(question, answers))
      .map((question) => ({
        id: question.id,
        prompt: question.prompt,
        response: formatAnswerForSummary(question, answers[question.id]),
      })),
  }))
}

function buildSummaryText(snapshot: SummarySnapshot, consent: ConsentState): string {
  const consentLines = profileSurvey.intro.consent.map((item) => {
    const value = consent[item.id] ? 'Sí' : 'No'
    return `- ${item.label}: ${value}`
  })

  const sectionBlocks = snapshot.map((section) => {
    const questionLines = section.questions.map((question) => {
      const value = question.response || 'Sin respuesta'
      return `- ${question.prompt}: ${value}`
    })

    return [`## ${section.title}`, ...questionLines].join('\n')
  })

  return ['# Consentimientos', ...consentLines, '', ...sectionBlocks].join('\n\n')
}

function formatAnswerForSummary(question: Question, answer?: AnswerValue): string {
  if (!answer) {
    return ''
  }

  switch (answer.kind) {
    case 'text':
    case 'url':
      return answer.value
    case 'single':
      if (!answer.value) return ''
      if (answer.value === 'other') {
        return answer.otherText ?? 'Otro (sin especificar)'
      }
      return getOptionLabel(question, answer.value)
    case 'multi': {
      const labels = answer.values.map((value) => {
        if (value === 'other') {
          return answer.otherText ? `Otro: ${answer.otherText}` : 'Otro (sin especificar)'
        }
        return getOptionLabel(question, value)
      })
      return labels.join(', ')
    }
    case 'file': {
      if (!answer.files.length) return ''
      return answer.files.map((file) => `${file.name} (${formatBytes(file.size)})`).join(', ')
    }
    default:
      return ''
  }
}

function getOptionLabel(question: Question, value: string): string {
  if (question.type !== 'single_choice' && question.type !== 'multi_choice') {
    return value
  }

  const option = question.options.find((option) => option.value === value)
  return option?.label ?? value
}

function cleanupHiddenAnswers(answers: AnswersState): AnswersState {
  const cleaned: AnswersState = { ...answers }

  profileSurvey.sections.forEach((section) => {
    section.questions.forEach((question) => {
      if (!isQuestionVisible(question, cleaned)) {
        delete cleaned[question.id]
      }
    })
  })

  return cleaned
}

function normalizeAnswer(question: Question, value: any): AnswerValue | undefined {
  if (value === null || typeof value === 'undefined') {
    return undefined
  }

  switch (question.type) {
    case 'short_text':
    case 'long_text':
      if (typeof value === 'string') {
        return { kind: 'text', value }
      }
      if (typeof value === 'object' && typeof value.value === 'string') {
        return { kind: 'text', value: value.value }
      }
      return { kind: 'text', value: '' }
    case 'url':
      if (typeof value === 'string') {
        return { kind: 'url', value }
      }
      if (typeof value === 'object' && typeof value.value === 'string') {
        return { kind: 'url', value: value.value }
      }
      return { kind: 'url', value: '' }
    case 'single_choice': {
      if (typeof value === 'object' && value !== null) {
        return {
          kind: 'single',
          value: typeof value.value === 'string' ? value.value : null,
          otherText: typeof value.otherText === 'string' ? value.otherText : undefined,
        }
      }
      if (typeof value === 'string') {
        return { kind: 'single', value }
      }
      return { kind: 'single', value: null }
    }
    case 'multi_choice': {
      if (typeof value === 'object' && value !== null) {
        const values = Array.isArray(value.values) ? value.values : []
        return {
          kind: 'multi',
          values,
          otherText: typeof value.otherText === 'string' ? value.otherText : undefined,
        }
      }
      if (Array.isArray(value)) {
        return { kind: 'multi', values: value }
      }
      return { kind: 'multi', values: [] }
    }
    case 'file': {
      if (typeof value === 'object' && value !== null) {
        const files = Array.isArray(value.files) ? value.files : []
        return {
          kind: 'file',
          files: files.map((file: any) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        }
      }
      return { kind: 'file', files: [] }
    }
    default:
      return undefined
  }
}

function buildFileAnswer(attachmentList: AttachmentRecord[]): FileAnswer {
  return {
    kind: 'file',
    files: attachmentList.map((attachment) => ({
      name: attachment.filename,
      size: attachment.sizeBytes ?? 0,
      type: attachment.contentType ?? undefined,
      attachmentId: attachment.id,
    })),
  }
}

export default function Questionnaire() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [consent, setConsent] = useState<ConsentState>(initialConsentState)
  const [answers, setAnswers] = useState<AnswersState>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [sectionProgress, setSectionProgress] = useState<SectionProgressState>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<AttachmentRecord[]>([])
  const [uploadingQuestionId, setUploadingQuestionId] = useState<string | null>(null)
  const [certificationChecked, setCertificationChecked] = useState(false)

  const progressPercent = (() => {
    const effectiveIndex = Math.min(currentStepIndex, FORM_STEPS_COUNT)
    if (FORM_STEPS_COUNT === 0) return 100
    return Math.round((effectiveIndex / FORM_STEPS_COUNT) * 100)
  })()

  const nextStepTitle =
    currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1].title : ''
  const previousStepTitle =
    currentStepIndex > 0 ? steps[currentStepIndex - 1].title : ''

  useEffect(() => {
    async function loadSubmission() {
      setLoading(true)
      setServerError(null)
      try {
        const response = await axios.get('/api/profile-submissions/current')
        const data = response.data

        if (data) {
          const incomingAnswers: AnswersState = {}
          const attachmentList: AttachmentRecord[] = (data.attachments ?? []).map((attachment: any) => ({
            id: attachment.id,
            questionId: attachment.questionId,
            filename: attachment.filename,
            fileUrl: attachment.fileUrl,
            contentType: attachment.contentType ?? null,
            sizeBytes: typeof attachment.sizeBytes === 'number' ? attachment.sizeBytes : null,
            storageProvider: attachment.storageProvider ?? null,
            uploadedAt: attachment.uploadedAt,
            downloadUrl: attachment.downloadUrl,
          }))

          profileSurvey.sections.forEach((section) => {
            section.questions.forEach((question) => {
              const normalized = normalizeAnswer(question, data.answers?.[question.id])
              if (normalized) {
                incomingAnswers[question.id] = normalized
              }
            })
          })

          const baseAnswers = cleanupHiddenAnswers(incomingAnswers)

          profileSurvey.sections.forEach((section) => {
            section.questions
              .filter((question) => question.type === 'file')
              .forEach((question) => {
                const questionAttachments = attachmentList.filter((attachment) => attachment.questionId === question.id)
                baseAnswers[question.id] = buildFileAnswer(questionAttachments)
              })
          })

          setAttachments(attachmentList)
          setAnswers(baseAnswers)
          setConsent({ ...initialConsentState(), ...(data.consentData ?? {}) })
          setSectionProgress(data.sectionProgress ?? {})
          setSubmissionId(data.id)
          if (data.status === REQUIRED_STATUS) {
            setSubmitSuccess(true)
            setCurrentStepIndex(steps.length - 1) // Go to "submitted" step
          } else {
            const resumeIndex = determineResumeStep(data.sectionProgress ?? {})
            setCurrentStepIndex(resumeIndex)
          }
        } else {
          const creation = await axios.post('/api/profile-submissions', {
            consentData: initialConsentState(),
            answers: {},
            sectionProgress: {},
            summarySnapshot: [],
            summaryText: '',
          })
          setSubmissionId(creation.data.id)
          setAnswers({})
          setAttachments([])
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          try {
            const creation = await axios.post('/api/profile-submissions', {
              consentData: initialConsentState(),
              answers: {},
              sectionProgress: {},
              summarySnapshot: [],
              summaryText: '',
            })
            setSubmissionId(creation.data.id)
            setAnswers({})
            setAttachments([])
            setSectionProgress({})
            setConsent(initialConsentState())
            return
          } catch (creationError) {
            console.error('Error creating profile submission after 404:', creationError)
            setServerError('No se pudo iniciar el formulario. Inténtalo nuevamente.')
            return
          }
        }
        console.error('Error loading profile submission', error)
        setServerError('No se pudo cargar el formulario. Inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    loadSubmission()
  }, [])

  useEffect(() => {
    if (!loading) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [currentStepIndex, loading])

  function determineResumeStep(progress: SectionProgressState): number {
    for (let index = 0; index < steps.length - 1; index += 1) {
      const step = steps[index]
      if (!progress[step.id]?.completed) {
        return index
      }
    }
    return steps.length - 1
  }

  function clearError(questionId: string) {
    setErrors((prev) => {
      if (!(questionId in prev)) return prev
      const next = { ...prev }
      delete next[questionId]
      return next
    })
  }

  async function saveSubmission(options?: {
    answersOverride?: AnswersState
    sectionProgressOverride?: SectionProgressState
    status?: string
  }) {
    if (!submissionId) return

    const answersToSave = options?.answersOverride ?? answers
    const sectionProgressToSave = options?.sectionProgressOverride ?? sectionProgress
    const snapshot = buildSummarySnapshot(answersToSave)
    const summaryText = buildSummaryText(snapshot, consent)

    const payload = {
      answers: answersToSave,
      consentData: consent,
      sectionProgress: sectionProgressToSave,
      summarySnapshot: snapshot,
      summaryText,
      status: options?.status ?? undefined,
    }

    setSaving(true)
    setServerError(null)

    try {
      const response = await axios.put(
        `/api/profile-submissions/${submissionId}`,
        payload,
      )
      if (response.data?.status === REQUIRED_STATUS) {
        setSubmitSuccess(true)
      }
    } catch (error) {
      console.error('Error saving profile submission', error)
      setServerError('No se pudo guardar el progreso. Verifica tu conexión e inténtalo nuevamente.')
      throw error
    } finally {
      setSaving(false)
    }
  }

  function handleConsentToggle(id: string, checked: boolean) {
    setConsent((prev) => ({ ...prev, [id]: checked }))
    clearError(id)
  }

  function handleTextChange(question: Question, value: string) {
    const kind = question.type === 'url' ? 'url' : 'text'
    const normalizedValue = value ?? ''
    setAnswers((prev) =>
      cleanupHiddenAnswers({
        ...prev,
        [question.id]: { kind, value: normalizedValue } as TextAnswer | UrlAnswer,
      }),
    )
    clearError(question.id)
  }

  function handleSingleChoiceChange(
    question: Question,
    option: ChoiceOption,
  ) {
    setAnswers((prev) => {
      const previous = (prev[question.id] as SingleChoiceAnswer | undefined) ?? {
        kind: 'single',
        value: null,
      }

      const next: SingleChoiceAnswer = {
        kind: 'single',
        value: option.value,
        otherText: option.value === 'other' ? previous.otherText : undefined,
      }

      return cleanupHiddenAnswers({
        ...prev,
        [question.id]: next,
      })
    })
    clearError(question.id)
  }

  function handleSingleOtherChange(question: Question, text: string) {
    setAnswers((prev) => {
      const previous = (prev[question.id] as SingleChoiceAnswer | undefined) ?? {
        kind: 'single',
        value: 'other',
      }
      return {
        ...prev,
        [question.id]: {
          ...previous,
          kind: 'single',
          value: 'other',
          otherText: text,
        },
      }
    })
    clearError(question.id)
  }

  function handleMultiChoiceChange(
    question: Question,
    option: ChoiceOption,
  ) {
    if (question.type !== 'multi_choice') {
      return
    }

    setAnswers((prev) => {
      const previous = (prev[question.id] as MultiChoiceAnswer | undefined) ?? {
        kind: 'multi',
        values: [],
        otherText: undefined,
      }

      let values = [...previous.values]

      if (values.includes(option.value)) {
        values = values.filter((value) => value !== option.value)
      } else {
        if (
          question.maxSelections &&
          values.length >= question.maxSelections
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [question.id]: `Solo puedes seleccionar hasta ${question.maxSelections} opciones.`,
          }))
          return prev
        }
        values.push(option.value)
      }

      const hasNone = values.includes('none')
      if (hasNone && values.length > 1) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [question.id]: 'No puedes seleccionar "Ninguno" junto con otras opciones.',
        }))
      } else {
        clearError(question.id)
      }

      const next: MultiChoiceAnswer = {
        kind: 'multi',
        values,
        otherText: values.includes('other') ? previous.otherText : undefined,
      }

      const updated = cleanupHiddenAnswers({
        ...prev,
        [question.id]: next,
      })

      return updated
    })
  }

  function handleMultiOtherChange(
    question: Question,
    text: string,
  ) {
    if (question.type !== 'multi_choice') {
      return
    }

    setAnswers((prev) => {
      const previous = (prev[question.id] as MultiChoiceAnswer | undefined) ?? {
        kind: 'multi',
        values: ['other'],
      }
      const nextValues = previous.values.includes('other')
        ? previous.values
        : [...previous.values, 'other']
      const updatedAnswer: MultiChoiceAnswer = {
        ...previous,
        kind: 'multi',
        values: nextValues,
        otherText: text,
      }
      const updatedAnswers = {
        ...prev,
        [question.id]: updatedAnswer,
      }

      const selectionsExcludingOther = updatedAnswer.values.filter((value) => value !== 'other')
      if (selectionsExcludingOther.includes('none') && selectionsExcludingOther.length > 1) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [question.id]: 'No puedes seleccionar "Ninguno" junto con otras opciones.',
        }))
      } else {
        clearError(question.id)
      }

      return updatedAnswers
    })
  }

  async function handleFileChange(question: Question, files: FileList | null) {
    if (!submissionId || question.type !== 'file' || !files || files.length === 0) {
      return
    }

    const existingCount = attachments.filter((attachment) => attachment.questionId === question.id).length
    if (question.maxFiles && existingCount + files.length > question.maxFiles) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [question.id]: `Solo puedes adjuntar hasta ${question.maxFiles} archivo(s).`,
      }))
      return
    }

    setUploadingQuestionId(question.id)
    setServerError(null)

    const newlyUploaded: AttachmentRecord[] = []

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('questionId', question.id)
        formData.append('file', file)

        const response = await axios.post(
          `/api/profile-submissions/${submissionId}/attachments`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const attachment: AttachmentRecord = {
          id: response.data.id,
          questionId: response.data.questionId,
          filename: response.data.filename,
          fileUrl: response.data.fileUrl,
          contentType: response.data.contentType ?? null,
          sizeBytes: typeof response.data.sizeBytes === 'number' ? response.data.sizeBytes : null,
          storageProvider: response.data.storageProvider ?? null,
          uploadedAt: response.data.uploadedAt,
          downloadUrl: response.data.downloadUrl,
        }

        newlyUploaded.push(attachment)
      }

      const nextAttachments = [...attachments, ...newlyUploaded]
      setAttachments(nextAttachments)

      const attachmentsForQuestion = nextAttachments.filter((attachment) => attachment.questionId === question.id)
      const nextAnswers = {
        ...answers,
        [question.id]: buildFileAnswer(attachmentsForQuestion),
      }

      setAnswers(nextAnswers)
      clearError(question.id)

      await saveSubmission({ answersOverride: nextAnswers })
    } catch (error) {
      console.error('Error uploading file', error)
      setServerError('No se pudo cargar el archivo. Inténtalo nuevamente.')
    } finally {
      setUploadingQuestionId(null)
    }
  }

  async function handleDeleteAttachment(question: Question, attachmentId: string) {
    if (!submissionId || question.type !== 'file') {
      return
    }

    setServerError(null)
    try {
      await axios.delete(
        `/api/profile-submissions/${submissionId}/attachments/${attachmentId}`,
      )

      const nextAttachments = attachments.filter((attachment) => attachment.id !== attachmentId)
      setAttachments(nextAttachments)

      const attachmentsForQuestion = nextAttachments.filter((attachment) => attachment.questionId === question.id)
      const nextAnswers = {
        ...answers,
        [question.id]: buildFileAnswer(attachmentsForQuestion),
      }

      setAnswers(nextAnswers)
      clearError(question.id)
      await saveSubmission({ answersOverride: nextAnswers })
    } catch (error) {
      console.error('Error deleting attachment', error)
      setServerError('No se pudo eliminar el archivo. Inténtalo nuevamente.')
    }
  }

  async function handleDownloadAttachment(attachmentId: string) {
    if (!submissionId) return

    try {
      const response = await axios.get(
        `/api/profile-submissions/${submissionId}/attachments/${attachmentId}/url`,
      )
      const downloadUrl = response.data.url
      if (downloadUrl) {
        setAttachments((prev) =>
          prev.map((attachment) =>
            attachment.id === attachmentId
              ? { ...attachment, downloadUrl }
              : attachment,
          ),
        )
        window.open(downloadUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.error('Error getting attachment URL', error)
      setServerError('No se pudo obtener el archivo. Inténtalo nuevamente.')
    }
  }

  function validateIntro(): boolean {
    const introErrors: Record<string, string> = {}

    profileSurvey.intro.consent.forEach((item) => {
      if (item.required && !consent[item.id]) {
        introErrors[item.id] = 'Este consentimiento es obligatorio para continuar.'
      }
    })

    setErrors((prev) => ({ ...prev, ...introErrors }))

    if (Object.keys(introErrors).length > 0) {
      const firstKey = Object.keys(introErrors)[0]
      queueMicrotask(() => {
        document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return false
    }

    return true
  }

  function validateSection(section: SurveySection): boolean {
    const sectionErrors: Record<string, string> = {}

    section.questions.forEach((question) => {
      if (!isQuestionVisible(question, answers)) {
        return
      }

      const answer = answers[question.id]

      switch (question.type) {
        case 'short_text':
        case 'long_text': {
          const value = (answer as TextAnswer | undefined)?.value ?? ''
          if (question.required && !value.trim()) {
            sectionErrors[question.id] = 'Este campo es obligatorio.'
          } else if (question.wordLimit && wordCount(value) > question.wordLimit) {
            sectionErrors[question.id] = `Máximo ${question.wordLimit} palabras.`
          }
          break
        }
        case 'url': {
          const value = (answer as UrlAnswer | undefined)?.value ?? ''
          if (question.required && !value.trim()) {
            sectionErrors[question.id] = 'Este campo es obligatorio.'
          } else if (value.trim()) {
            const trimmed = value.trim()
            const hasProtocol = /^[a-zA-Z][\w+.-]*:/.test(trimmed)
            const candidate = hasProtocol ? trimmed : `https://${trimmed}`
            try {
              // eslint-disable-next-line no-new
              new URL(candidate)
            } catch {
              sectionErrors[question.id] = 'Ingresa una URL válida.'
            }
          }
          break
        }
        case 'single_choice': {
          const choice = answer as SingleChoiceAnswer | undefined
          if (question.required && (!choice || !choice.value)) {
            sectionErrors[question.id] = 'Selecciona una opción.'
          } else if (
            choice?.value === 'other' &&
            question.options.some((option) => option.value === 'other' && option.allowFreeText) &&
            !choice.otherText?.trim()
          ) {
            sectionErrors[question.id] = 'Describe la opción "Otro".'
          }
          break
        }
        case 'multi_choice': {
          const multi = answer as MultiChoiceAnswer | undefined
          const selectionCount = multi?.values?.length ?? 0
          if (question.required && selectionCount === 0) {
            sectionErrors[question.id] = 'Selecciona al menos una opción.'
          } else if (multi && multi.values.includes('none') && multi.values.length > 1) {
            sectionErrors[question.id] = 'No puedes seleccionar "Ninguno" junto con otras opciones.'
          } else if (
            multi?.values.includes('other') &&
            question.options.some((option) => option.value === 'other' && option.allowFreeText) &&
            !multi.otherText?.trim()
          ) {
            sectionErrors[question.id] = 'Describe la opción "Otro".'
          }
          break
        }
        case 'file': {
          const files = (answer as FileAnswer | undefined)?.files ?? []
          if (question.required && files.length === 0) {
            sectionErrors[question.id] = 'Adjunta al menos un archivo.'
          }
          break
        }
        default:
          break
      }
    })

    setErrors((prev) => {
      const updated = { ...prev }
      section.questions.forEach((question) => {
        delete updated[question.id]
      })
      return { ...updated, ...sectionErrors }
    })

    if (Object.keys(sectionErrors).length > 0) {
      const firstKey = Object.keys(sectionErrors)[0]
      queueMicrotask(() => {
        document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return false
    }

    return true
  }

  async function handleNext() {
    const currentStep = steps[currentStepIndex]

    if (currentStep.id === 'intro') {
      const isValid = validateIntro()
      if (!isValid) return

      const updatedProgress: SectionProgressState = {
        ...sectionProgress,
        intro: { completed: true, completedAt: new Date().toISOString() },
      }
      setSectionProgress(updatedProgress)
      await saveSubmission({ sectionProgressOverride: updatedProgress })
      setCurrentStepIndex((prev) => prev + 1)
      return
    }

    if (currentStep.id === 'summary') {
      return
    }

    const section = profileSurvey.sections.find((item) => item.id === currentStep.id)
    if (!section) return

    const isValid = validateSection(section)
    if (!isValid) return

    const updatedProgress: SectionProgressState = {
      ...sectionProgress,
      [section.id]: { completed: true, completedAt: new Date().toISOString() },
    }
    setSectionProgress(updatedProgress)
    await saveSubmission({ sectionProgressOverride: updatedProgress })
    setCurrentStepIndex((prev) => prev + 1)
  }

  function handleBack() {
    if (currentStepIndex === 0) return
    setCurrentStepIndex((prev) => prev - 1)
  }

  async function handleSubmit() {
    if (!certificationChecked) {
      setErrors((prev) => ({
        ...prev,
        certification: 'Debes certificar que las respuestas son fieles a la realidad para enviar el formulario.',
      }))
      return
    }
    try {
      await saveSubmission({ status: REQUIRED_STATUS })
      setSubmitSuccess(true)
      setCurrentStepIndex(steps.length - 1) // Go to "submitted" step
    } catch {
      // Error message handled in saveSubmission
    }
  }

  function renderConsentStep() {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-navy-800">
          {profileSurvey.intro.title}
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {profileSurvey.intro.description}
        </p>
        <div className="space-y-4">
          {profileSurvey.intro.consent.map((item) => {
            const hasError = !!errors[item.id]
            return (
              <label
                key={item.id}
                id={item.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                  hasError
                    ? 'border-red-400 bg-red-50/50'
                    : 'border-gray-200 hover:border-primary-400'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  checked={!!consent[item.id]}
                  onChange={(event) => handleConsentToggle(item.id, event.target.checked)}
                />
                <div className="flex-1">
                  <span className="text-base text-gray-800">
                    {item.label}
                    {item.required && <span className="text-primary-600 font-medium ml-1">*</span>}
                  </span>
                  {hasError && (
                    <p className="text-sm text-red-600 mt-1">{errors[item.id]}</p>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  function renderQuestion(section: SurveySection, question: Question, index: number) {
    const error = errors[question.id]
    const hasError = !!error
    const answer = answers[question.id]
    const baseClass = 'mt-2 block w-full rounded-xl border px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors'
    const inputClass = hasError
      ? `${baseClass} border-red-400 bg-red-50/70`
      : `${baseClass} border-gray-300 bg-white`

    const questionAttachments = attachments.filter((attachment) => attachment.questionId === question.id)

    const globalQuestionNumber = getGlobalQuestionNumber(section.id, index)
    const label = (
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-800">
            <span className="text-primary-600 font-semibold">{globalQuestionNumber}.</span>{' '}
            {question.prompt}
            {question.required && <span className="text-primary-600 font-semibold ml-1">*</span>}
          </h3>
        </div>
        {question.type === 'multi_choice' && question.maxSelections && (
          <span className="text-sm text-gray-500">
            Máx. {question.maxSelections} selecciones
          </span>
        )}
      </div>
    )

    return (
      <div
        key={question.id}
        id={question.id}
        className={`p-6 rounded-2xl border transition-colors ${
          hasError ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-white/80'
        }`}
      >
        {label}
        {question.type === 'short_text' || question.type === 'long_text' ? (
          <div className="mt-4 space-y-2">
            <textarea
              className={`${inputClass} resize-y min-h-[120px]`}
              value={(answer as TextAnswer | undefined)?.value ?? ''}
              onChange={(event) => handleTextChange(question, event.target.value)}
              placeholder="Escribe tu respuesta..."
            />
            {question.wordLimit && (
              <p
                className={`text-sm ${
                  wordCount((answer as TextAnswer | undefined)?.value ?? '') > question.wordLimit
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {wordCount((answer as TextAnswer | undefined)?.value ?? '')} / {question.wordLimit} palabras
              </p>
            )}
          </div>
        ) : null}

        {question.type === 'url' ? (
          <input
            type="text"
            className={`${inputClass} mt-4`}
            value={(answer as UrlAnswer | undefined)?.value ?? ''}
            onChange={(event) => handleTextChange(question, event.target.value)}
            placeholder="tu-sitio-web.com o https://tu-sitio-web.com"
          />
        ) : null}

        {question.type === 'single_choice' ? (
          <div className="mt-4 space-y-3">
            {question.options.map((option) => {
              const selected = (answer as SingleChoiceAnswer | undefined)?.value === option.value
              return (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400'
                  } transition-colors`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={selected}
                    onChange={() => handleSingleChoiceChange(question, option)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-gray-800">{option.label}</span>
                    {option.allowFreeText && selected && (
                      <input
                        type="text"
                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={(answer as SingleChoiceAnswer | undefined)?.otherText ?? ''}
                        onChange={(event) => handleSingleOtherChange(question, event.target.value)}
                        placeholder="Especifica la opción"
                      />
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        ) : null}

        {question.type === 'multi_choice' ? (
          <div className="mt-4 space-y-3">
            {question.options.map((option) => {
              const selected = (answer as MultiChoiceAnswer | undefined)?.values?.includes(option.value)
              return (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-400'
                  } transition-colors`}
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selected}
                    onChange={() => handleMultiChoiceChange(question, option)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <div className="flex-1">
                    <span className="text-gray-800">{option.label}</span>
                    {option.allowFreeText && selected && (
                      <input
                        type="text"
                        className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={(answer as MultiChoiceAnswer | undefined)?.otherText ?? ''}
                        onChange={(event) => handleMultiOtherChange(question, event.target.value)}
                        placeholder="Especifica la opción"
                      />
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        ) : null}

        {question.type === 'file' ? (
          <div className="mt-4 space-y-3">
            <input
              type="file"
              multiple={Boolean(question.maxFiles && question.maxFiles > 1)}
              onChange={(event) => handleFileChange(question, event.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-white hover:file:bg-primary-700"
            />
            <p className="text-sm text-gray-500">
              Los archivos se almacenarán de forma segura. Podrás reemplazarlos después.
            </p>
            {uploadingQuestionId === question.id && (
              <div className="flex items-center gap-2 text-sm text-primary-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando archivo...
              </div>
            )}
            {questionAttachments.length > 0 ? (
              <ul className="space-y-2">
                {questionAttachments.map((attachment) => (
                  <li
                    key={attachment.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary-500" />
                      <span>{attachment.filename}</span>
                      <span className="text-gray-400">
                        ({formatBytes(attachment.sizeBytes ?? 0)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadAttachment(attachment.id)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Descargar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttachment(question, attachment.id)}
                        className="text-red-500 hover:text-red-600 font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {question.helpText && (
          <p className="mt-3 text-sm text-gray-500">{question.helpText}</p>
        )}

        {hasError && (
          <p className="mt-3 text-sm font-medium text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>
    )
  }

  function renderSection(section: SurveySection) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-navy-800">{section.title}</h2>
          {section.description && (
            <p className="text-gray-600 mt-2">{section.description}</p>
          )}
        </div>
        <div className="space-y-6">
          {section.questions.map((question, index) =>
            isQuestionVisible(question, answers)
              ? renderQuestion(section, question, index)
              : null,
          )}
        </div>
      </div>
    )
  }

  function renderSummary() {
    const snapshot = buildSummarySnapshot(answers)

    return (
      <div className="space-y-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          {submitSuccess ? (
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-green-700">
                  ¡Perfilamiento enviado con éxito!
                </h2>
                <p className="text-gray-600 mt-2">
                  Hemos guardado toda la información. Si necesitas ajustar algo, puedes regresar a la sección correspondiente.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-100 p-2 text-primary-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-navy-800">
                  Verifica tu información antes de enviar
                </h2>
                <p className="text-gray-600 mt-2">
                  Revisa todas tus respuestas a continuación. Asegúrate de que toda la información sea correcta y fiel a la realidad. Puedes regresar a secciones anteriores para editar cualquier respuesta antes de enviar.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-navy-800 mb-4">Consentimientos otorgados</h3>
          <div className="space-y-3">
            {profileSurvey.intro.consent.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                <span className="text-gray-700">{item.label}</span>
                <span className={`font-semibold ${consent[item.id] ? 'text-primary-600' : 'text-gray-400'}`}>
                  {consent[item.id] ? 'Sí' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {snapshot.map((section, sectionIndex) => (
          <div key={section.id} className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-navy-800">{section.title}</h3>
                <p className="text-sm text-gray-500">
                  {section.questions.length} pregunta(s) respondida(s)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStepIndex(sectionIndex + 1)}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Editar sección
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {section.questions.map((question) => {
                const sectionDefinition = profileSurvey.sections.find((item) => item.id === section.id)
                const questionDefinition = sectionDefinition?.questions.find((item) => item.id === question.id)

                if (questionDefinition?.type === 'file') {
                  const questionAttachments = attachments.filter((attachment) => attachment.questionId === question.id)
                  return (
                    <div key={question.id} className="rounded-xl border border-gray-200 p-4 bg-gray-50/70">
                      <p className="text-sm font-medium text-gray-600">{question.prompt}</p>
                      {questionAttachments.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm text-gray-800">
                          {questionAttachments.map((attachment) => (
                            <li
                              key={attachment.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary-500" />
                                <span>{attachment.filename}</span>
                                <span className="text-gray-400">
                                  ({formatBytes(attachment.sizeBytes ?? 0)})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(attachment.id)}
                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                              >
                                Abrir
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 italic text-gray-400">Sin archivos adjuntos</p>
                      )}
                    </div>
                  )
                }

                return (
                  <div key={question.id} className="rounded-xl border border-gray-200 p-4 bg-gray-50/70">
                    <p className="text-sm font-medium text-gray-600">{question.prompt}</p>
                    <p className="mt-2 text-gray-800">
                      {question.response ? question.response : <span className="italic text-gray-400">Sin respuesta</span>}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {!submitSuccess && (
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                errors.certification
                  ? 'border-red-400 bg-red-50/50'
                  : 'border-gray-200 hover:border-primary-400'
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                checked={certificationChecked}
                onChange={(event) => {
                  setCertificationChecked(event.target.checked)
                  if (errors.certification) {
                    setErrors((prev) => {
                      const next = { ...prev }
                      delete next.certification
                      return next
                    })
                  }
                }}
              />
              <div className="flex-1">
                <span className="text-base text-gray-800">
                  Certifico que todas las respuestas son fieles a la realidad y dispongo de evidencia para sustentarlas cuando sea requerida.
                </span>
                {errors.certification && (
                  <p className="text-sm text-red-600 mt-1">{errors.certification}</p>
                )}
              </div>
            </label>
          </div>
        )}
      </div>
    )
  }

  function renderSubmittedStep() {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-green-700">
                Formulario de perfilamiento enviado
              </h2>
              <p className="text-gray-600 mt-2">
                Tu formulario de perfilamiento ha sido enviado exitosamente. Puedes ver el resumen completo o modificarlo si es necesario.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => {
              setSubmitSuccess(true) // Ensure success message is shown
              setCurrentStepIndex(steps.length - 2) // Go to summary step
            }}
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:border-primary-400 transition-colors text-left"
          >
            <h3 className="text-xl font-semibold text-navy-800 mb-2">Ver formulario diligenciado</h3>
            <p className="text-gray-600">
              Revisa todas las respuestas que enviaste en el formulario de perfilamiento.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubmitSuccess(false) // Allow modifications
              setCertificationChecked(false) // Reset certification checkbox
              setCurrentStepIndex(0) // Go to intro step
            }}
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:border-primary-400 transition-colors text-left"
          >
            <h3 className="text-xl font-semibold text-navy-800 mb-2">Modificar formulario</h3>
            <p className="text-gray-600">
              Realiza cambios en tu formulario. Tus respuestas anteriores se mantendrán y podrás editarlas.
            </p>
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
        <div className="flex items-center gap-3 text-primary-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">Cargando formulario...</span>
        </div>
      </div>
    )
  }

  const currentStep = steps[currentStepIndex]
  const currentSection = profileSurvey.sections.find(
    (section) => section.id === currentStep.id,
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Perfilamiento de soluciones EdTech</h1>
            <p className="text-gray-600 mt-1">
              Completa cada sección para compartir la información clave de tu solución. Puedes guardar y continuar más tarde.
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-gray-500">
              Paso {Math.min(currentStepIndex + 1, steps.length)} de {steps.length}
            </span>
          </div>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{currentStep.title}</span>
          <span>{progressPercent}% completado</span>
        </div>
      </header>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Tenemos un problema</p>
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        </div>
      )}

      {currentStep.id === 'intro' && renderConsentStep()}
      {currentStep.id !== 'intro' && currentStep.id !== 'summary' && currentStep.id !== 'submitted' && currentSection && renderSection(currentSection)}
      {currentStep.id === 'summary' && renderSummary()}
      {currentStep.id === 'submitted' && renderSubmittedStep()}

      {currentStep.id !== 'submitted' && (
      <footer className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStepIndex === 0 || saving}
          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-colors ${
            currentStepIndex === 0 || saving
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-600 hover:border-primary-400 hover:text-primary-600'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          {previousStepTitle ? `Volver: ${previousStepTitle}` : 'Volver'}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {saving && (
            <span className="inline-flex items-center gap-2 text-sm text-primary-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </span>
          )}
          {currentStep.id === 'summary' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || submitSuccess}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
            >
              <CheckCircle2 className="h-5 w-5" />
              {submitSuccess ? 'Encuesta enviada' : 'Enviar encuesta'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving || !submissionId}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
            >
              {currentStepIndex === steps.length - 2 ? 'Ir al resumen' : `Siguiente: ${nextStepTitle}`}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
      )}
    </div>
  )
}

