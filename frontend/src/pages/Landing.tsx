import { Link } from 'react-router-dom'
import { BookOpen, Building, Search, ArrowRight, CheckCircle, Users, Sparkles, ExternalLink } from 'lucide-react'
import Logo from '../components/Logo'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-navy-700 via-primary-700 to-navy-700 bg-clip-text text-transparent leading-tight">
            Conecta innovación<br />con aprendizaje
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            La plataforma que conecta necesidades educativas con soluciones tecnológicas 
            <span className="text-primary-700 font-semibold"> pertinentes y transformadoras</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/catalog"
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Explorar catálogo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/edtech/profile"
              className="w-full sm:w-auto px-8 py-4 bg-white text-green-800 border-2 border-green-700 rounded-lg hover:bg-green-50 transition-all font-semibold text-lg"
            >
              Test Perfilamiento de EdTechs
            </Link>
            <Link
              to="/institution/questionnaire"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-all font-semibold text-lg"
            >
              Test Radiografía de Colegios
            </Link>
          </div>
        </div>

        {/* Cards de acceso */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl border border-primary-100">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Empresas EdTech</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Perfila tu solución tecnológica y forma parte de nuestro catálogo de innovaciones educativas
            </p>
            <Link
              to="/edtech/profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Comenzar perfilamiento
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl border border-primary-100">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Instituciones Educativas</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Caracteriza tu institución y recibe recomendaciones personalizadas de soluciones EdTech
            </p>
            <Link
              to="/ie/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Comenzar caracterización
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl border border-primary-100">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Explorar Catálogo</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Busca y filtra soluciones EdTech con criterios específicos y encuentra la tecnología perfecta
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Explorar soluciones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Características destacadas */}
        <div className="bg-gradient-to-r from-primary-600 to-navy-700 rounded-3xl p-12 text-white mb-20 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              ¿Por qué elegir NODO+?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary-200" />
                <h3 className="text-xl font-semibold mb-2">Repositorio Estructurado</h3>
                <p className="text-primary-100">
                  Catálogo completo con fichas técnicas estandarizadas de todas las soluciones EdTech
                </p>
              </div>
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary-200" />
                <h3 className="text-xl font-semibold mb-2">Recomendaciones Inteligentes</h3>
                <p className="text-primary-100">
                  Matching automático entre necesidades educativas y soluciones tecnológicas
                </p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary-200" />
                <h3 className="text-xl font-semibold mb-2">Comunidad Conectada</h3>
                <p className="text-primary-100">
                  Facilita la conexión entre instituciones educativas y empresas innovadoras
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-12 border border-primary-100">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-navy-800">
              Sobre NODO+
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              NODO+ es una plataforma diseñada para <span className="text-primary-700 font-semibold">apoyar el proceso de conectar necesidades de aprendizaje y contextos educativos con soluciones tecnológicas pertinentes y transformadoras</span>. 
              Nuestra misión es facilitar el descubrimiento, evaluación y conexión entre instituciones educativas y empresas EdTech, 
              creando un ecosistema donde la innovación educativa pueda florecer.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="px-4 py-2 bg-primary-50 rounded-full">✓ Fichas técnicas estandarizadas</span>
              <span className="px-4 py-2 bg-primary-50 rounded-full">✓ Sistema de filtros avanzados</span>
              <span className="px-4 py-2 bg-primary-50 rounded-full">✓ Evaluación con semáforos de calidad</span>
              <span className="px-4 py-2 bg-primary-50 rounded-full">✓ Recomendaciones personalizadas</span>
            </div>
          </div>
        </div>

        {/* Call to Action Final */}
        <div className="text-center bg-gradient-to-r from-primary-50 to-navy-50 rounded-3xl p-12 border-2 border-primary-200">
          <h3 className="text-3xl font-bold text-navy-800 mb-4">
            ¿Listo para comenzar?
          </h3>
          <p className="text-gray-700 mb-8 text-lg">
            Únete a nuestra comunidad y transforma la educación con tecnología
          </p>
          <Link
            to="/edtech/profile"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-navy-700 to-primary-700 text-white rounded-lg hover:from-navy-800 hover:to-primary-800 transition-all font-semibold text-lg shadow-lg"
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo size="sm" />
            <span className="text-xl font-bold">NODO+</span>
          </div>
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
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-primary-200 text-sm mt-4">
            Transformando la educación en América Latina mediante la implementación estratégica de tecnologías educativas
          </p>
          <p className="text-primary-200 text-xs mt-4">
            © 2024 Nogales+. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
