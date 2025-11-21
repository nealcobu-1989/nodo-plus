import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nodo-plus.com' },
    update: {},
    create: {
      email: 'admin@nodo-plus.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  })
  console.log('✅ Admin user created:', admin.email)

  // Crear cuentas de administradores adicionales
  const adminPassword2025 = await bcrypt.hash('NogalesPlus2025', 10)
  const adminEmails = [
    'aceron@nogalesplus.com',
    'cchild@nogalesplus.com',
    'lmoreno@nogalesplus.com',
    'acontreras@nogales.edu.co'
  ]

  for (const email of adminEmails) {
    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {
        password: adminPassword2025,
        role: 'ADMIN'
      },
      create: {
        email,
        password: adminPassword2025,
        role: 'ADMIN'
      }
    })
    console.log('✅ Admin user created:', adminUser.email)
  }

  // Crear catálogos iniciales
  const catalogs = [
    // Niveles educativos
    { type: 'level', label: 'Preescolar', value: 'preescolar', order: 1 },
    { type: 'level', label: 'Primaria', value: 'primaria', order: 2 },
    { type: 'level', label: 'Secundaria', value: 'secundaria', order: 3 },
    { type: 'level', label: 'Media', value: 'media', order: 4 },
    { type: 'level', label: 'Superior', value: 'superior', order: 5 },
    
    // Áreas temáticas
    { type: 'area', label: 'Matemáticas', value: 'matematicas', order: 1 },
    { type: 'area', label: 'Lenguaje', value: 'lenguaje', order: 2 },
    { type: 'area', label: 'Ciencias', value: 'ciencias', order: 3 },
    { type: 'area', label: 'Sociales', value: 'sociales', order: 4 },
    { type: 'area', label: 'Inglés', value: 'ingles', order: 5 },
    { type: 'area', label: 'STEM', value: 'stem', order: 6 },
    
    // Tipos de producto
    { type: 'productType', label: 'App móvil', value: 'app-movil', order: 1 },
    { type: 'productType', label: 'Plataforma web', value: 'plataforma-web', order: 2 },
    { type: 'productType', label: 'Hardware', value: 'hardware', order: 3 },
    { type: 'productType', label: 'Contenido digital', value: 'contenido-digital', order: 4 },
    { type: 'productType', label: 'Kit educativo', value: 'kit-educativo', order: 5 },
    
    // Contextos
    { type: 'context', label: 'Alta conectividad', value: 'alta-conectividad', order: 1 },
    { type: 'context', label: 'Baja conectividad', value: 'baja-conectividad', order: 2 },
    { type: 'context', label: 'Sin conectividad', value: 'sin-conectividad', order: 3 },
    { type: 'context', label: 'Rural', value: 'rural', order: 4 },
    { type: 'context', label: 'Urbano', value: 'urbano', order: 5 },
    
    // Dispositivos
    { type: 'device', label: 'Android', value: 'android', order: 1 },
    { type: 'device', label: 'iOS', value: 'ios', order: 2 },
    { type: 'device', label: 'Windows', value: 'windows', order: 3 },
    { type: 'device', label: 'Mac', value: 'mac', order: 4 },
    { type: 'device', label: 'Tablet', value: 'tablet', order: 5 },
    { type: 'device', label: 'PC/Laptop', value: 'pc-laptop', order: 6 },
  ]

  for (const catalog of catalogs) {
    await prisma.catalog.upsert({
      where: { value: catalog.value },
      update: {},
      create: catalog
    })
  }
  console.log(`✅ Created ${catalogs.length} catalog items`)

  // Crear reglas de semáforos por defecto (6 criterios)
  const trafficLightRules = [
    {
      axis: 'pedagogical',
      thresholdRed: 40,
      thresholdYellow: 70,
      weights: {}
    },
    {
      axis: 'adaptability',
      thresholdRed: 40,
      thresholdYellow: 70,
      weights: {}
    },
    {
      axis: 'impact',
      thresholdRed: 40,
      thresholdYellow: 70,
      weights: {}
    },
    {
      axis: 'organizational',
      thresholdRed: 40,
      thresholdYellow: 70,
      weights: {}
    },
    {
      axis: 'technicalQuality',
      thresholdRed: 40,
      thresholdYellow: 70,
      weights: {}
    },
    {
      axis: 'affordability',
      thresholdRed: 40,
      thresholdYellow: 70,
      weights: {}
    }
  ]

  // Crear reglas de semáforos (no hay unique constraint, así que verificamos si existen primero)
  for (const rule of trafficLightRules) {
    const existing = await prisma.trafficLightRule.findFirst({
      where: {
        axis: rule.axis,
        active: true
      }
    })

    if (!existing) {
      await prisma.trafficLightRule.create({
        data: {
          ...rule,
          weights: rule.weights as any
        }
      })
    }
  }
  console.log('✅ Created traffic light rules')

  // Crear EdTechs colombianas
  const edtechsData = [
    {
      email: 'contacto@platzi.com',
      company: {
        name: 'Platzi',
        country: 'Colombia',
        contactEmail: 'contacto@platzi.com',
        website: 'https://platzi.com'
      },
      solution: {
        name: 'Platzi - Plataforma de Educación Online',
        description: 'Plataforma de educación online que ofrece cursos de programación, diseño, marketing y más. Con metodología práctica y comunidad activa.',
        websiteUrl: 'https://platzi.com',
        levels: ['superior'],
        areas: ['STEM', 'matematicas'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad', 'urbano'],
        devices: ['pc-laptop', 'tablet'],
        businessModels: ['suscripcion'],
        security: ['autenticacion', 'encriptacion'],
        adaptability: ['personalizacion', 'multilenguaje'],
        priceRange: '$10-50',
        status: 'APPROVED',
        pedagogicalScore: 85,
        adaptabilityScore: 80,
        impactScore: 90,
        organizationalScore: 75,
        technicalQualityScore: 88,
        affordabilityScore: 70,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'YELLOW'
      }
    },
    {
      email: 'info@arukay.com',
      company: {
        name: 'Arukay',
        country: 'Colombia',
        contactEmail: 'info@arukay.com',
        website: 'https://arukay.com'
      },
      solution: {
        name: 'Arukay - Programación para Niños',
        description: 'Plataforma interactiva para enseñar programación a niños y adolescentes mediante juegos y proyectos creativos.',
        websiteUrl: 'https://arukay.com',
        levels: ['primaria', 'secundaria', 'media'],
        areas: ['STEM', 'matematicas'],
        productTypes: ['plataforma-web', 'app-movil'],
        contexts: ['alta-conectividad', 'baja-conectividad'],
        devices: ['pc-laptop', 'tablet', 'android'],
        businessModels: ['suscripcion', 'licencia-institucional'],
        security: ['autenticacion'],
        adaptability: ['personalizacion', 'edad-adaptada'],
        priceRange: '$20-100',
        status: 'APPROVED',
        pedagogicalScore: 82,
        adaptabilityScore: 85,
        impactScore: 78,
        organizationalScore: 70,
        technicalQualityScore: 80,
        affordabilityScore: 65,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'YELLOW',
        organizationalColor: 'YELLOW',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'YELLOW',
        logoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'contacto@cloudlabs.us',
      company: {
        name: 'CloudLabs',
        country: 'Colombia',
        contactEmail: 'contacto@cloudlabs.us',
        website: 'https://cloudlabs.us'
      },
      solution: {
        name: 'CloudLabs - Laboratorios Virtuales',
        description: 'Plataforma de laboratorios virtuales para ciencias naturales, química, física y biología. Ideal para instituciones sin infraestructura física.',
        websiteUrl: 'https://cloudlabs.us',
        levels: ['secundaria', 'media', 'superior'],
        areas: ['ciencias', 'STEM'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad', 'baja-conectividad'],
        devices: ['pc-laptop', 'tablet'],
        businessModels: ['licencia-institucional'],
        security: ['autenticacion', 'encriptacion'],
        adaptability: ['personalizacion'],
        priceRange: '$500-1000',
        status: 'APPROVED',
        pedagogicalScore: 88,
        adaptabilityScore: 75,
        impactScore: 85,
        organizationalScore: 80,
        technicalQualityScore: 90,
        affordabilityScore: 50,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'YELLOW',
        impactColor: 'GREEN',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'RED',
        logoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'info@ticmas.com',
      company: {
        name: 'Ticmas',
        country: 'Colombia',
        contactEmail: 'info@ticmas.com',
        website: 'https://ticmas.com'
      },
      solution: {
        name: 'Ticmas - Soluciones Educativas Integrales',
        description: 'Plataforma educativa integral con contenido curricular, herramientas de gestión y seguimiento para instituciones educativas.',
        websiteUrl: 'https://ticmas.com',
        levels: ['primaria', 'secundaria', 'media'],
        areas: ['matematicas', 'lenguaje', 'ciencias', 'sociales'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad'],
        devices: ['pc-laptop', 'tablet'],
        businessModels: ['licencia-institucional'],
        security: ['autenticacion', 'encriptacion', 'gdpr'],
        adaptability: ['personalizacion', 'multilenguaje'],
        priceRange: '$500-2000',
        status: 'APPROVED',
        pedagogicalScore: 90,
        adaptabilityScore: 85,
        impactScore: 88,
        organizationalScore: 90,
        technicalQualityScore: 85,
        affordabilityScore: 45,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'RED',
        logoUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'contacto@crehana.com',
      company: {
        name: 'Crehana Colombia',
        country: 'Colombia',
        contactEmail: 'contacto@crehana.com',
        website: 'https://crehana.com'
      },
      solution: {
        name: 'Crehana - Educación Creativa Online',
        description: 'Plataforma de cursos online especializada en habilidades creativas, diseño, marketing digital y emprendimiento.',
        websiteUrl: 'https://crehana.com',
        levels: ['superior'],
        areas: ['STEM'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad', 'urbano'],
        devices: ['pc-laptop', 'tablet', 'android', 'ios'],
        businessModels: ['suscripcion'],
        security: ['autenticacion'],
        adaptability: ['personalizacion'],
        priceRange: '$15-60',
        status: 'APPROVED',
        pedagogicalScore: 78,
        adaptabilityScore: 82,
        impactScore: 75,
        organizationalScore: 72,
        technicalQualityScore: 82,
        affordabilityScore: 72,
        pedagogicalColor: 'YELLOW',
        adaptabilityColor: 'GREEN',
        impactColor: 'YELLOW',
        organizationalColor: 'YELLOW',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'YELLOW'
      }
    },
    {
      email: 'info@edutecno.co',
      company: {
        name: 'EduTecno',
        country: 'Colombia',
        contactEmail: 'info@edutecno.co',
        website: 'https://edutecno.co'
      },
      solution: {
        name: 'EduTecno - Gestión Escolar',
        description: 'Sistema integral de gestión escolar para administrar calificaciones, asistencia, comunicaciones y recursos educativos.',
        websiteUrl: 'https://edutecno.co',
        levels: ['primaria', 'secundaria', 'media'],
        areas: ['matematicas', 'lenguaje', 'ciencias'],
        productTypes: ['plataforma-web', 'app-movil'],
        contexts: ['alta-conectividad'],
        devices: ['pc-laptop', 'android', 'ios'],
        businessModels: ['licencia-institucional', 'suscripcion'],
        security: ['autenticacion', 'encriptacion'],
        adaptability: ['personalizacion'],
        priceRange: '$200-800',
        status: 'APPROVED',
        pedagogicalScore: 70,
        adaptabilityScore: 75,
        impactScore: 72,
        organizationalScore: 88,
        technicalQualityScore: 78,
        affordabilityScore: 60,
        pedagogicalColor: 'YELLOW',
        adaptabilityColor: 'YELLOW',
        impactColor: 'YELLOW',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'YELLOW',
        affordabilityColor: 'YELLOW',
        logoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'contacto@welbin.co',
      company: {
        name: 'Welbin',
        country: 'Colombia',
        contactEmail: 'contacto@welbin.co',
        website: 'https://welbin.co'
      },
      solution: {
        name: 'Welbin - Plataforma de Aprendizaje Adaptativo',
        description: 'Sistema de aprendizaje adaptativo que personaliza el contenido educativo según el ritmo y necesidades de cada estudiante.',
        websiteUrl: 'https://welbin.co',
        levels: ['primaria', 'secundaria', 'media'],
        areas: ['matematicas', 'lenguaje', 'ciencias', 'stem'],
        productTypes: ['plataforma-web', 'app-movil'],
        contexts: ['alta-conectividad'],
        devices: ['pc-laptop', 'tablet', 'android', 'ios'],
        businessModels: ['licencia-institucional', 'suscripcion'],
        security: ['autenticacion', 'encriptacion', 'gdpr'],
        adaptability: ['personalizacion', 'adaptativo', 'multilenguaje'],
        priceRange: '$300-1500',
        status: 'APPROVED',
        pedagogicalScore: 92,
        adaptabilityScore: 95,
        impactScore: 88,
        organizationalScore: 82,
        technicalQualityScore: 90,
        affordabilityScore: 55,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'RED',
        logoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'info@codecraft.co',
      company: {
        name: 'CodeCraft',
        country: 'Colombia',
        contactEmail: 'info@codecraft.co',
        website: 'https://codecraft.co'
      },
      solution: {
        name: 'CodeCraft - Aprendizaje de Programación',
        description: 'Plataforma gamificada para enseñar programación y pensamiento computacional a estudiantes desde primaria hasta universidad.',
        websiteUrl: 'https://codecraft.co',
        levels: ['primaria', 'secundaria', 'media', 'superior'],
        areas: ['stem', 'matematicas'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad', 'baja-conectividad'],
        devices: ['pc-laptop', 'tablet'],
        businessModels: ['suscripcion', 'licencia-institucional'],
        security: ['autenticacion', 'encriptacion'],
        adaptability: ['personalizacion', 'gamificacion'],
        priceRange: '$50-300',
        status: 'APPROVED',
        pedagogicalScore: 87,
        adaptabilityScore: 90,
        impactScore: 85,
        organizationalScore: 75,
        technicalQualityScore: 88,
        affordabilityScore: 68,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'YELLOW',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'YELLOW',
        logoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'contacto@eduflex.co',
      company: {
        name: 'EduFlex',
        country: 'Colombia',
        contactEmail: 'contacto@eduflex.co',
        website: 'https://eduflex.co'
      },
      solution: {
        name: 'EduFlex - Gestión Académica y Aprendizaje',
        description: 'Solución integral que combina gestión académica, aprendizaje virtual y seguimiento de estudiantes en una sola plataforma.',
        websiteUrl: 'https://eduflex.co',
        levels: ['primaria', 'secundaria', 'media'],
        areas: ['matematicas', 'lenguaje', 'ciencias', 'sociales', 'ingles'],
        productTypes: ['plataforma-web', 'app-movil'],
        contexts: ['alta-conectividad'],
        devices: ['pc-laptop', 'tablet', 'android', 'ios'],
        businessModels: ['licencia-institucional'],
        security: ['autenticacion', 'encriptacion', 'gdpr'],
        adaptability: ['personalizacion', 'multilenguaje'],
        priceRange: '$400-1200',
        status: 'APPROVED',
        pedagogicalScore: 83,
        adaptabilityScore: 78,
        impactScore: 80,
        organizationalScore: 92,
        technicalQualityScore: 85,
        affordabilityScore: 58,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'YELLOW',
        impactColor: 'GREEN',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'RED',
        logoUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'info@mentoresdigitales.co',
      company: {
        name: 'Mentores Digitales',
        country: 'Colombia',
        contactEmail: 'info@mentoresdigitales.co',
        website: 'https://mentoresdigitales.co'
      },
      solution: {
        name: 'Mentores Digitales - Tutoria y Apoyo Virtual',
        description: 'Plataforma de tutoría virtual que conecta estudiantes con mentores expertos para apoyo académico personalizado.',
        websiteUrl: 'https://mentoresdigitales.co',
        levels: ['primaria', 'secundaria', 'media', 'superior'],
        areas: ['matematicas', 'lenguaje', 'ciencias', 'stem', 'ingles'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad'],
        devices: ['pc-laptop', 'tablet'],
        businessModels: ['suscripcion'],
        security: ['autenticacion', 'encriptacion'],
        adaptability: ['personalizacion'],
        priceRange: '$30-150',
        status: 'APPROVED',
        pedagogicalScore: 85,
        adaptabilityScore: 80,
        impactScore: 82,
        organizationalScore: 70,
        technicalQualityScore: 78,
        affordabilityScore: 72,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'YELLOW',
        technicalQualityColor: 'YELLOW',
        affordabilityColor: 'YELLOW',
        logoUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'contacto@viralearning.co',
      company: {
        name: 'ViraLearning',
        country: 'Colombia',
        contactEmail: 'contacto@viralearning.co',
        website: 'https://viralearning.co'
      },
      solution: {
        name: 'ViraLearning - Contenido Educativo Interactivo',
        description: 'Biblioteca de contenido educativo interactivo con videos, simulaciones y actividades para diferentes niveles y áreas.',
        websiteUrl: 'https://viralearning.co',
        levels: ['preescolar', 'primaria', 'secundaria', 'media'],
        areas: ['matematicas', 'lenguaje', 'ciencias', 'sociales', 'ingles'],
        productTypes: ['plataforma-web', 'contenido-digital'],
        contexts: ['alta-conectividad', 'baja-conectividad'],
        devices: ['pc-laptop', 'tablet', 'android'],
        businessModels: ['suscripcion', 'licencia-institucional'],
        security: ['autenticacion'],
        adaptability: ['personalizacion', 'multilenguaje'],
        priceRange: '$100-500',
        status: 'APPROVED',
        pedagogicalScore: 88,
        adaptabilityScore: 85,
        impactScore: 90,
        organizationalScore: 78,
        technicalQualityScore: 83,
        affordabilityScore: 65,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'YELLOW',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'YELLOW',
        logoUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'info@learnia.com.co',
      company: {
        name: 'Learnia',
        country: 'Colombia',
        contactEmail: 'info@learnia.com.co',
        website: 'https://learnia.com.co'
      },
      solution: {
        name: 'Learnia - LMS para Instituciones',
        description: 'Sistema de gestión de aprendizaje (LMS) completo con herramientas de evaluación, comunicación y análisis de desempeño.',
        websiteUrl: 'https://learnia.com.co',
        levels: ['secundaria', 'media', 'superior'],
        areas: ['matematicas', 'lenguaje', 'ciencias', 'sociales'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad'],
        devices: ['pc-laptop', 'tablet'],
        businessModels: ['licencia-institucional'],
        security: ['autenticacion', 'encriptacion', 'gdpr'],
        adaptability: ['personalizacion'],
        priceRange: '$600-2000',
        status: 'APPROVED',
        pedagogicalScore: 85,
        adaptabilityScore: 82,
        impactScore: 83,
        organizationalScore: 90,
        technicalQualityScore: 87,
        affordabilityScore: 48,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'RED',
        logoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'contacto@edukids.co',
      company: {
        name: 'EduKids',
        country: 'Colombia',
        contactEmail: 'contacto@edukids.co',
        website: 'https://edukids.co'
      },
      solution: {
        name: 'EduKids - Plataforma para Primera Infancia',
        description: 'Plataforma educativa especializada en primera infancia con actividades lúdicas y contenido apropiado para niños pequeños.',
        websiteUrl: 'https://edukids.co',
        levels: ['preescolar', 'primaria'],
        areas: ['lenguaje', 'matematicas', 'ciencias'],
        productTypes: ['plataforma-web', 'app-movil'],
        contexts: ['alta-conectividad'],
        devices: ['tablet', 'android', 'ios'],
        businessModels: ['suscripcion', 'licencia-institucional'],
        security: ['autenticacion', 'gdpr'],
        adaptability: ['edad-adaptada', 'personalizacion'],
        priceRange: '$40-200',
        status: 'APPROVED',
        pedagogicalScore: 90,
        adaptabilityScore: 93,
        impactScore: 85,
        organizationalScore: 75,
        technicalQualityScore: 80,
        affordabilityScore: 70,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'GREEN',
        impactColor: 'GREEN',
        organizationalColor: 'YELLOW',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'YELLOW',
        logoUrl: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'info@stemlab.co',
      company: {
        name: 'STEMLab Colombia',
        country: 'Colombia',
        contactEmail: 'info@stemlab.co',
        website: 'https://stemlab.co'
      },
      solution: {
        name: 'STEMLab - Laboratorios Virtuales STEM',
        description: 'Plataforma de laboratorios virtuales especializada en ciencias, tecnología, ingeniería y matemáticas con simulaciones realistas.',
        websiteUrl: 'https://stemlab.co',
        levels: ['secundaria', 'media', 'superior'],
        areas: ['ciencias', 'stem', 'matematicas'],
        productTypes: ['plataforma-web'],
        contexts: ['alta-conectividad', 'baja-conectividad'],
        devices: ['pc-laptop', 'tablet'],
        businessModels: ['licencia-institucional'],
        security: ['autenticacion', 'encriptacion'],
        adaptability: ['personalizacion'],
        priceRange: '$450-1500',
        status: 'APPROVED',
        pedagogicalScore: 91,
        adaptabilityScore: 77,
        impactScore: 89,
        organizationalScore: 85,
        technicalQualityScore: 92,
        affordabilityScore: 52,
        pedagogicalColor: 'GREEN',
        adaptabilityColor: 'YELLOW',
        impactColor: 'GREEN',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'RED',
        logoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop' // Placeholder gato
      }
    },
    {
      email: 'contacto@educhat.co',
      company: {
        name: 'EduChat',
        country: 'Colombia',
        contactEmail: 'contacto@educhat.co',
        website: 'https://educhat.co'
      },
      solution: {
        name: 'EduChat - Comunicación Escolar',
        description: 'Plataforma de comunicación entre padres, estudiantes y docentes con mensajería, notificaciones y seguimiento académico.',
        websiteUrl: 'https://educhat.co',
        levels: ['preescolar', 'primaria', 'secundaria', 'media'],
        areas: ['matematicas', 'lenguaje', 'ciencias', 'sociales'],
        productTypes: ['app-movil', 'plataforma-web'],
        contexts: ['alta-conectividad'],
        devices: ['android', 'ios', 'pc-laptop'],
        businessModels: ['licencia-institucional', 'suscripcion'],
        security: ['autenticacion', 'encriptacion', 'gdpr'],
        adaptability: ['personalizacion'],
        priceRange: '$150-600',
        status: 'APPROVED',
        pedagogicalScore: 68,
        adaptabilityScore: 72,
        impactScore: 75,
        organizationalScore: 95,
        technicalQualityScore: 80,
        affordabilityScore: 62,
        pedagogicalColor: 'YELLOW',
        adaptabilityColor: 'YELLOW',
        impactColor: 'YELLOW',
        organizationalColor: 'GREEN',
        technicalQualityColor: 'GREEN',
        affordabilityColor: 'YELLOW',
        logoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop' // Placeholder gato
      }
    }
  ]

  // Crear usuarios y EdTechs
  for (const edtechData of edtechsData) {
    const userPassword = await bcrypt.hash('pass', 10)
    const user = await prisma.user.upsert({
      where: { email: edtechData.email },
      update: {
        password: userPassword,
        role: 'EDTECH'
      },
      create: {
        email: edtechData.email,
        password: userPassword,
        role: 'EDTECH'
      }
    })

    const company = await prisma.edTechCompany.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        ...edtechData.company
      }
    })

    // Verificar si ya existe una solución
    const existingSolution = await prisma.solution.findFirst({
      where: {
        edtechCompanyId: company.id,
        name: edtechData.solution.name
      }
    })

    if (!existingSolution) {
      await prisma.solution.create({
        data: {
          edtechCompanyId: company.id,
          approvedAt: new Date(),
          approvedBy: admin.id,
          ...edtechData.solution
        }
      })
    }
  }
  console.log(`✅ Created ${edtechsData.length} EdTech companies with solutions`)

  // Crear instituciones educativas colombianas
  const institutionsData = [
    {
      email: 'info@colegiolosnogales.edu.co',
      name: 'Colegio Los Nogales',
      type: 'privada',
      location: 'Bogotá D.C.',
      rural: false,
      contactEmail: 'info@colegiolosnogales.edu.co',
      website: 'https://www.colegiolosnogales.edu.co'
    },
    {
      email: 'contacto@porunamana.edu.co',
      name: 'Jardín Infantil Por un Mañana',
      type: 'privada',
      location: 'Bogotá D.C.',
      rural: false,
      contactEmail: 'contacto@porunamana.edu.co',
      website: 'https://porunamana.edu.co'
    },
    {
      email: 'info@angloamericana.edu.co',
      name: 'Colegio Anglo Americano',
      type: 'privada',
      location: 'Bogotá D.C.',
      rural: false,
      contactEmail: 'info@angloamericana.edu.co',
      website: 'https://www.angloamericana.edu.co'
    },
    {
      email: 'contacto@cng.edu.co',
      name: 'Colegio Nueva Granada',
      type: 'privada',
      location: 'Bogotá D.C.',
      rural: false,
      contactEmail: 'contacto@cng.edu.co',
      website: 'https://www.cng.edu'
    },
    {
      email: 'contacto@colegionuevogimnasio.edu.co',
      name: 'Colegio Nuevo Gimnasio',
      type: 'privada',
      location: 'Bogotá D.C.',
      rural: false,
      contactEmail: 'contacto@colegionuevogimnasio.edu.co',
      website: 'https://www.colegionuevogimnasio.edu.co'
    },
    {
      email: 'info@colegiosanpatricio.edu.co',
      name: 'Colegio San Patricio',
      type: 'privada',
      location: 'Bogotá D.C.',
      rural: false,
      contactEmail: 'info@colegiosanpatricio.edu.co',
      website: 'https://www.colegiosanpatricio.edu.co'
    },
    {
      email: 'contacto@colegioingles.edu.co',
      name: 'Colegio Inglés de los Andes',
      type: 'privada',
      location: 'Bogotá D.C.',
      rural: false,
      contactEmail: 'contacto@colegioingles.edu.co',
      website: 'https://www.colegioingles.edu.co'
    },
    {
      email: 'administracion@colegiofemenino.edu.co',
      name: 'Colegio Femenino de Bucaramanga',
      type: 'privada',
      location: 'Bucaramanga, Santander',
      rural: false,
      contactEmail: 'administracion@colegiofemenino.edu.co',
      website: 'https://www.colegiofemenino.edu.co'
    },
    {
      email: 'info@colegioamericano.edu.co',
      name: 'Colegio Americano de Medellín',
      type: 'privada',
      location: 'Medellín, Antioquia',
      rural: false,
      contactEmail: 'info@colegioamericano.edu.co',
      website: 'https://www.colegioamericano.edu.co'
    },
    {
      email: 'secretaria@colegioliceofrances.edu.co',
      name: 'Liceo Francés de Pereira',
      type: 'privada',
      location: 'Pereira, Risaralda',
      rural: false,
      contactEmail: 'secretaria@colegioliceofrances.edu.co',
      website: 'https://www.liceofrances.edu.co'
    },
    {
      email: 'contacto@colegiocentro.edu.co',
      name: 'Colegio Centro Pedagógico de Cali',
      type: 'privada',
      location: 'Cali, Valle del Cauca',
      rural: false,
      contactEmail: 'contacto@colegiocentro.edu.co',
      website: 'https://www.colegiocentro.edu.co'
    },
    {
      email: 'info@colegioruralvalledupar.edu.co',
      name: 'Institución Educativa Rural San José',
      type: 'pública',
      location: 'Valledupar, Cesar',
      rural: true,
      contactEmail: 'info@colegioruralvalledupar.edu.co'
    },
    {
      email: 'coordinacion@colegiobilingue.edu.co',
      name: 'Colegio Bilingüe de Barranquilla',
      type: 'privada',
      location: 'Barranquilla, Atlántico',
      rural: false,
      contactEmail: 'coordinacion@colegiobilingue.edu.co',
      website: 'https://www.colegiobilingue.edu.co'
    },
    {
      email: 'administracion@colegiopublicomanizales.edu.co',
      name: 'Institución Educativa Normal Superior de Manizales',
      type: 'pública',
      location: 'Manizales, Caldas',
      rural: false,
      contactEmail: 'administracion@colegiopublicomanizales.edu.co'
    }
  ]

  // Crear usuarios e instituciones educativas
  for (const instData of institutionsData) {
    const userPassword = await bcrypt.hash('pass', 10)
    const user = await prisma.user.upsert({
      where: { email: instData.email },
      update: {
        password: userPassword,
        role: 'IE'
      },
      create: {
        email: instData.email,
        password: userPassword,
        role: 'IE'
      }
    })

    const existingInstitution = await prisma.institution.findUnique({
      where: { userId: user.id }
    })

    if (!existingInstitution) {
      await prisma.institution.create({
        data: {
          userId: user.id,
          name: instData.name,
          type: instData.type,
          location: instData.location,
          rural: instData.rural,
          status: 'APPROVED',
          approvedAt: new Date(),
          characterizationData: {
            contactEmail: instData.contactEmail,
            website: instData.website || null,
            registeredDate: new Date().toISOString(),
            interest: 'Explorar soluciones EdTech para mejorar el aprendizaje de nuestros estudiantes'
          }
        }
      })
    }
  }
  console.log(`✅ Created ${institutionsData.length} educational institutions`)

  // Crear 10 cuentas de colegios de prueba para la encuesta
  const testInstitutionsData = []
  for (let i = 1; i <= 10; i++) {
    testInstitutionsData.push({
      email: `testcolegio${i}@nodo-plus.com`,
      name: `Colegio de Prueba ${i}`,
      type: i % 2 === 0 ? 'pública' : 'privada',
      location: 'Bogotá D.C.',
      rural: i > 7,
      contactEmail: `testcolegio${i}@nodo-plus.com`,
    })
  }

  for (const instData of testInstitutionsData) {
    const userPassword = await bcrypt.hash('pass', 10)
    const user = await prisma.user.upsert({
      where: { email: instData.email },
      update: {
        password: userPassword,
        role: 'IE'
      },
      create: {
        email: instData.email,
        password: userPassword,
        role: 'IE'
      }
    })

    const existingInstitution = await prisma.institution.findUnique({
      where: { userId: user.id }
    })

    if (!existingInstitution) {
      await prisma.institution.create({
        data: {
          userId: user.id,
          name: instData.name,
          type: instData.type,
          location: instData.location,
          rural: instData.rural,
          status: 'APPROVED',
          approvedAt: new Date(),
          characterizationData: {
            contactEmail: instData.contactEmail,
            registeredDate: new Date().toISOString(),
            interest: 'Prueba de radiografía de colegios'
          }
        }
      })
    }
  }
  console.log(`✅ Created ${testInstitutionsData.length} test institutions for questionnaire`)

  // Crear usuarios de prueba (solo acceso EDTECH)
  const testerPassword = await bcrypt.hash('pass', 10)
  const testerCount = 10
  for (let index = 1; index <= testerCount; index += 1) {
    const email = `tester${index}@nodo-plus.com`
    await prisma.user.upsert({
      where: { email },
      update: {
        password: testerPassword,
        role: 'EDTECH',
      },
      create: {
        email,
        password: testerPassword,
        role: 'EDTECH',
      },
    })
  }
  console.log(`✅ Created ${testerCount} tester users (role EDTECH, password "pass")`)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

