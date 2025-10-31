import { useState, useEffect } from 'react'
import axios from 'axios'
import { ExternalLink, ArrowUp, ArrowDown } from 'lucide-react'
import InitialLogo from '../../components/InitialLogo'

interface Solution {
  id: string
  name: string
  description: string
  websiteUrl?: string
  logoUrl?: string
  edtechCompany: {
    name: string
    country: string
  }
  pedagogicalScore: number
  adaptabilityScore: number
  impactScore: number
  organizationalScore: number
  technicalQualityScore: number
  affordabilityScore: number
}

export default function Catalog() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadSolutions()
  }, [sortBy, sortOrder])

  const loadSolutions = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/catalog/solutions', {
        params: {
          sortBy,
          sortOrder
        }
      })
      console.log('API Response:', response.data)
      setSolutions(response.data.solutions || [])
    } catch (error: any) {
      console.error('Error loading solutions:', error)
      console.error('Error details:', error.response?.data || error.message)
      // Mostrar error al usuario
      alert(`Error al cargar soluciones: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catálogo de Soluciones EdTech</h1>
        <p className="text-gray-600">Explora las mejores soluciones educativas de Colombia</p>
      </div>

      {selectedSolution ? (
        <SolutionDetail solution={selectedSolution} onBack={() => setSelectedSolution(null)} />
      ) : (
        <>
          {/* Filtros de ordenamiento */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Nombre (Alfabético)</option>
                <option value="createdAt">Más recientes</option>
                <option value="pedagogicalScore">Pedagógico</option>
                <option value="adaptabilityScore">Adaptabilidad</option>
                <option value="impactScore">Impacto</option>
                <option value="organizationalScore">Organizacional</option>
                <option value="technicalQualityScore">Calidad Técnica</option>
                <option value="affordabilityScore">Accesibilidad</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors flex items-center gap-2"
                title={sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
              >
                {sortOrder === 'asc' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {sortOrder === 'asc' ? 'Menor a Mayor' : 'Mayor a Menor'}
              </button>
            </div>
          </div>

          {/* Grid de soluciones */}
          {solutions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">No se encontraron soluciones EdTech.</p>
              <p className="text-gray-500 text-sm">Verifica que el backend esté corriendo en el puerto 3001.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  onClick={() => setSelectedSolution(solution)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {solution.logoUrl ? (
                      <img
                        src={solution.logoUrl}
                        alt={solution.edtechCompany.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          // Si falla la imagen, ocultar y mostrar inicial
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            e.currentTarget.style.display = 'none'
                            const initialDiv = parent.querySelector('.initial-logo-fallback')
                            if (initialDiv) {
                              (initialDiv as HTMLElement).style.display = 'flex'
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div className="initial-logo-fallback" style={{ display: solution.logoUrl ? 'none' : 'flex' }}>
                      <InitialLogo name={solution.edtechCompany.name} size="md" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-navy-800 mb-1">{solution.name}</h3>
                      <p className="text-sm text-gray-600">{solution.edtechCompany.name}</p>
                    </div>
                    {solution.websiteUrl && (
                      <ExternalLink className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{solution.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      {solution.edtechCompany.country}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SolutionDetail({ solution, onBack }: { solution: Solution; onBack: () => void }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-primary-600 hover:text-primary-700 font-medium"
      >
        ← Volver al catálogo
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {solution.logoUrl ? (
              <img
                src={solution.logoUrl}
                alt={solution.edtechCompany.name}
                className="w-24 h-24 rounded-lg object-cover"
                onError={(e) => {
                  // Si falla la imagen, ocultar y mostrar inicial
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    e.currentTarget.style.display = 'none'
                    const initialDiv = parent.querySelector('.initial-logo-fallback')
                    if (initialDiv) {
                      (initialDiv as HTMLElement).style.display = 'flex'
                    }
                  }
                }}
              />
            ) : null}
            <div className="initial-logo-fallback" style={{ display: solution.logoUrl ? 'none' : 'flex' }}>
              <InitialLogo name={solution.edtechCompany.name} size="lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-navy-800 mb-2">{solution.name}</h2>
              <p className="text-lg text-gray-600 mb-4">{solution.edtechCompany.name}</p>
              {solution.websiteUrl && (
                <a
                  href={solution.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Visitar sitio web
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Descripción</h3>
          <p className="text-gray-700">{solution.description}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Evaluación</h3>
          <SpiderChart solution={solution} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ScoreCard
            label="Pedagógico"
            score={solution.pedagogicalScore}
            color="blue"
          />
          <ScoreCard
            label="Adaptabilidad"
            score={solution.adaptabilityScore}
            color="green"
          />
          <ScoreCard
            label="Impacto"
            score={solution.impactScore}
            color="purple"
          />
          <ScoreCard
            label="Organizacional"
            score={solution.organizationalScore}
            color="orange"
          />
          <ScoreCard
            label="Calidad Técnica"
            score={solution.technicalQualityScore}
            color="teal"
          />
          <ScoreCard
            label="Accesibilidad"
            score={solution.affordabilityScore}
            color="red"
          />
        </div>
      </div>
    </div>
  )
}

function SpiderChart({ solution }: { solution: Solution }) {
  const data = [
    { name: 'Pedagógico', value: solution.pedagogicalScore || 0 },
    { name: 'Adaptabilidad', value: solution.adaptabilityScore || 0 },
    { name: 'Impacto', value: solution.impactScore || 0 },
    { name: 'Organizacional', value: solution.organizationalScore || 0 },
    { name: 'Calidad Técnica', value: solution.technicalQualityScore || 0 },
    { name: 'Accesibilidad', value: solution.affordabilityScore || 0 },
  ]

  // Crear gráfico de telaraña simple con SVG
  const centerX = 200
  const centerY = 200
  const radius = 150
  const numPoints = data.length

  const getPointCoordinates = (index: number, value: number) => {
    const angle = (2 * Math.PI * index) / numPoints - Math.PI / 2
    const distance = (radius * value) / 100
    return {
      x: centerX + distance * Math.cos(angle),
      y: centerY + distance * Math.sin(angle),
      labelX: centerX + (radius + 30) * Math.cos(angle),
      labelY: centerY + (radius + 30) * Math.sin(angle),
      angle: (angle * 180) / Math.PI
    }
  }

  const points = data.map((item, index) => getPointCoordinates(index, item.value))
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <div className="flex justify-center items-center">
      <svg width="450" height="450" viewBox="0 0 450 450" className="max-w-full">
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {points.map((point, i) => (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={point.labelX}
            y2={point.labelY}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Data area */}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgb(59, 130, 246)"
          />
        ))}

        {/* Labels */}
        {points.map((point, i) => (
          <text
            key={i}
            x={point.labelX}
            y={point.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-medium fill-gray-700"
          >
            {data[i].name}
          </text>
        ))}

        {/* Score labels */}
        {points.map((point, i) => (
          <text
            key={`score-${i}`}
            x={point.x}
            y={point.y - 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-primary-600"
          >
            {data[i].value}
          </text>
        ))}
      </svg>
    </div>
  )
}

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  const getColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      teal: 'bg-teal-100 text-teal-700 border-teal-300',
      red: 'bg-red-100 text-red-700 border-red-300',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className={`border-2 rounded-lg p-4 ${getColorClass(color)}`}>
      <div className={`text-sm font-medium mb-2`}>{label}</div>
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-xs mt-1">/ 100</div>
    </div>
  )
}
