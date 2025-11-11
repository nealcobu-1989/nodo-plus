export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multi_choice'
  | 'url'
  | 'file';

export type ConsentItem = {
  id: string;
  label: string;
  required: boolean;
};

export type ChoiceOption = {
  value: string;
  label: string;
  allowFreeText?: boolean;
};

export type QuestionDependency = {
  questionId: string;
  expectedAnswers: string[];
};

export type QuestionCommon = {
  id: string;
  prompt: string;
  type: QuestionType;
  required?: boolean;
  helpText?: string;
  wordLimit?: number;
  dependsOn?: QuestionDependency;
};

export type TextQuestion = QuestionCommon & {
  type: 'short_text' | 'long_text';
};

export type ChoiceQuestion = QuestionCommon & {
  type: 'single_choice' | 'multi_choice';
  options: ChoiceOption[];
  maxSelections?: number;
};

export type UrlQuestion = QuestionCommon & {
  type: 'url';
};

export type FileQuestion = QuestionCommon & {
  type: 'file';
  maxFiles?: number;
};

export type Question =
  | TextQuestion
  | ChoiceQuestion
  | UrlQuestion
  | FileQuestion;

export type SurveySection = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

export type ProfileSurvey = {
  intro: {
    title: string;
    description: string;
    consent: ConsentItem[];
  };
  sections: SurveySection[];
};

export const profileSurvey: ProfileSurvey = {
  intro: {
    title: 'Perfilamiento de soluciones EdTech',
    description:
      'Este formulario permite perfilar y visibilizar tu solución en Nodo, generando insumos útiles para mejorar producto, evidencia y usabilidad, y facilitando su mapeo frente a comunidades educativas y aliados.',
    consent: [
      {
        id: 'consent_data_use',
        label:
          'Autorizo a Nogales+ a recolectar y tratar la información de este formulario para fines de análisis y curaduría en Nodo.',
        required: true,
      },
      {
        id: 'consent_publication',
        label:
          'Autorizo a Nogales+ a publicar en Nodo los datos que proporciono en este formulario.',
        required: false,
      },
    ],
  },
  sections: [
    {
      id: 'section_1',
      title: 'Información de la organización y de la solución',
      questions: [
        {
          id: 's1_q1',
          prompt: 'Nombre de la organización (razón social)',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q2',
          prompt: 'Nombre de la solución (producto)',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q3',
          prompt: 'Descripción de la solución / Propuesta de valor',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q4',
          prompt: 'Sitio web de la solución / URL',
          type: 'url',
          required: true,
        },
        {
          id: 's1_q5',
          prompt: 'País / Jurisdicción de registro legal',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q6',
          prompt: '¿La entidad está legalmente constituida?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'yes', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's1_q7',
          prompt: 'Tipo de entidad',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'company', label: 'Empresa' },
            { value: 'ngo', label: 'ONG/OSC' },
            { value: 'philanthropic', label: 'Organización filantrópica' },
            { value: 'international', label: 'Organización internacional' },
            { value: 'academic', label: 'Institución académica' },
            { value: 'government', label: 'Agencia gubernamental' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's1_q8',
          prompt: 'Nombre de quien diligencia este formulario',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q9',
          prompt: 'Correo electrónico de contacto',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q10',
          prompt:
            '¿Qué tipo de producto describe mejor tu solución? (Seleccione todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'online_platform', label: 'Plataforma online' },
            { value: 'mobile_app', label: 'Aplicación móvil' },
            { value: 'diagnostic_tool', label: 'Herramienta diagnóstica' },
            { value: 'assessment_tool', label: 'Herramienta de evaluación' },
            { value: 'planning_tool', label: 'Herramienta de planeación' },
            { value: 'tutoring', label: 'Tutoría y preparación para exámenes' },
            { value: 'chatbot', label: 'Chatbot' },
            { value: 'software', label: 'Software' },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's1_q11',
          prompt: '¿Tu solución incorpora Inteligencia Artificial?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'yes', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's1_q12',
          prompt:
            '¿Cuáles son las áreas temáticas en las que trabaja tu solución? (Seleccione todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'literacy', label: 'Lectoescritura' },
            { value: 'math', label: 'Matemáticas' },
            { value: 'socioemotional', label: 'Habilidades socioemocionales' },
            { value: 'computational_thinking', label: 'Pensamiento computacional' },
            { value: 'stem', label: 'STEM' },
            { value: 'history', label: 'Historia' },
            {
              value: '21st_century_skills',
              label: 'Habilidades del siglo XXI',
            },
            { value: 'english', label: 'Inglés (y/o idiomas)' },
            { value: 'education_management', label: 'Gestión educativa' },
            { value: 'upskilling', label: 'Upskilling / reskilling' },
            { value: 'digital_skills', label: 'Habilidades digitales' },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's1_q13',
          prompt:
            '¿En qué etapa educativa está enfocada la solución? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            {
              value: 'early_childhood',
              label: 'Educación Inicial (Primera infancia)',
            },
            { value: 'primary', label: 'Educación primaria' },
            { value: 'lower_secondary', label: 'Secundaria baja' },
            { value: 'upper_secondary', label: 'Secundaria alta' },
            {
              value: 'tvet',
              label: 'Educación y formación técnica y profesional',
            },
            { value: 'tertiary', label: 'Educación terciaria' },
            { value: 'non_formal', label: 'Educación no formal' },
            {
              value: 'reskilling',
              label: 'Recualificación / Capacitación laboral (upskilling)',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's1_q14',
          prompt:
            '¿Para quién está principalmente diseñada tu solución tecnológica? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            {
              value: 'teachers_capabilities',
              label:
                'Para docentes: fortalece sus capacidades, apoya la planeación de clases y/o la evaluación, y/o ayuda a reducir carga administrativa.',
            },
            {
              value: 'teachers_in_class',
              label:
                'Para el uso del docente en aula: permite lecciones interactivas, con contenido digital, diseñadas para entornos uno-a-muchos.',
            },
            {
              value: 'students',
              label:
                'Para estudiantes: aprendizaje personalizado y a ritmo diferenciado, ya sea de manera independiente o con apoyo del docente.',
            },
            {
              value: 'families',
              label:
                'Para familias/padres: las informa y vincula, apoyando el aprendizaje más allá del aula.',
            },
            {
              value: 'leadership',
              label: 'Para equipos de liderazgo y gestión escolar.',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
      ],
    },
    {
      id: 'section_2',
      title: 'Seguridad y bienestar digital',
      questions: [
        {
          id: 's2_q1',
          prompt:
            'Adjunta la política de uso, privacidad y manejo de datos de la empresa (archivo público y vigente).',
          type: 'file',
          required: false,
          maxFiles: 1,
        },
        {
          id: 's2_q2',
          prompt:
            '¿Dónde se almacenan los datos de usuarios recolectados y quién es el responsable de esa base de datos?',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's2_q3',
          prompt:
            '¿La solución muestra alertas/avisos cuando hay cambios relevantes en la política de privacidad, prácticas de recolección o uso de datos?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'yes', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's2_q4',
          prompt:
            '¿Vendes o compartes con terceros datos personales o no personales de usuarios?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'yes', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's2_q5',
          prompt:
            '¿Los datos de niñas, niños y adolescentes se usan para marketing por tu organización o por terceros?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'yes', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's2_q6',
          prompt:
            '¿Cuáles de los siguientes aspectos de seguridad y bienestar digital están presentes en tu solución? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            {
              value: 'time_management',
              label:
                'La herramienta ayuda a que los estudiantes gestionen su tiempo digital de manera efectiva y a limitar el uso excesivo.',
            },
            {
              value: 'wellbeing_features',
              label:
                'Se incluyen funcionalidades explícitas para aportar al bienestar digital de los usuarios.',
            },
            {
              value: 'open_policies',
              label:
                'La solución comunica de forma abierta sus políticas de privacidad y manejo de datos.',
            },
            {
              value: 'data_minimization',
              label: 'La recopilación de datos se limita a lo necesario para el funcionamiento.',
            },
            {
              value: 'user_control',
              label: 'Los usuarios tienen opciones para gestionar o revisar su propia información.',
            },
            {
              value: 'technical_measures',
              label:
                'Se aplican medidas técnicas para proteger la información frente a incidentes.',
            },
            {
              value: 'explicit_consent',
              label: 'La solución solicita consentimiento explícito para recolectar datos.',
            },
            {
              value: 'incident_response',
              label:
                'Existen procedimientos definidos para responder a posibles fallos de seguridad.',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's2_q7',
          prompt:
            '(Solo si usas IA generativa) Adjunta tu política de IA responsable y mitigación de sesgos (archivo o URL).',
          type: 'file',
          required: false,
          helpText: 'Puedes adjuntar un archivo o compartir una URL dentro del nombre del archivo comprimido.',
          maxFiles: 1,
        },
      ],
    },
    {
      id: 'section_3',
      title: 'Evidencia en acción',
      questions: [
        {
          id: 's3_q1',
          prompt:
            '¿Con cuáles insumos y evidencias cuenta hoy tu organización para sustentar su modelo de negocio y/o su modelo de impacto? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'toc', label: 'Teoría de Cambio (ToC) vigente' },
            { value: 'logical_framework', label: 'Marco lógico / Marco de resultados' },
            { value: 'literature_review', label: 'Revisión de literatura / evidencia' },
            {
              value: 'merl_plan',
              label:
                'Plan MERL (Monitoreo, Evaluación, Rendición de cuentas y Aprendizaje)',
            },
            { value: 'bmc', label: 'Business Model Canvas' },
            { value: 'vpc', label: 'Value Proposition Canvas' },
            { value: 'financial_model', label: 'Modelo financiero y unit economics' },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's3_q2',
          prompt:
            '¿Qué metodologías utiliza tu organización para evaluar, aprender y mejorar el impacto de su solución EdTech? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            {
              value: 'product_analytics',
              label:
                'Analítica de producto (dashboards, métricas de uso por rol/IE, funnels, cohortes, errores, tiempos de sesión).',
            },
            {
              value: 'diagnostics',
              label:
                'Diagnósticos de entrada/salida (pre–post) de percepción y satisfacción.',
            },
            {
              value: 'learning_measurement',
              label:
                'Medición de aprendizaje (pre–post académico) con instrumentos validados.',
            },
            { value: 'quasi_experimental', label: 'Estudios correlacionales / cuasi-experimentales' },
            { value: 'rct', label: 'Evaluaciones RCT' },
            { value: 'case_studies', label: 'Estudios de caso' },
            {
              value: 'ab_testing',
              label:
                'Pruebas A/B o experimentación controlada (ej: comparación de contenidos o funcionalidades).',
            },
            {
              value: 'qual_methods',
              label:
                'Herramientas/métodos cualitativos sistemáticos (rúbricas, observaciones, grupos focales).',
            },
            {
              value: 'process_evaluation',
              label:
                'Evaluaciones de proceso e implementación (cobertura, adherencia, calidad).',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's3_q3',
          prompt:
            '¿Qué tipos de indicadores monitorea tu solución de forma regular? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            {
              value: 'user_experience',
              label:
                'Experiencia del usuario / Satisfacción (NPS, activación, engagement, casos de uso).',
            },
            {
              value: 'educational_outcomes',
              label:
                'Resultados educativos / impacto (aprendizajes, uso docente, resultados socioemocionales).',
            },
            {
              value: 'business_sustainability',
              label:
                'Negocio / sostenibilidad (retención, CAC, LTV, ingresos recurrentes).',
            },
            {
              value: 'compliance_operations',
              label:
                'Cumplimiento y operación (cobertura, beneficiarios, privacidad, seguridad de datos).',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's3_q4',
          prompt:
            'Adjunta documentos relevantes (hasta 8 archivos: ToC, Marco lógico, Plan MERL, Value Proposition Canvas, casos de estudio, testimonios, evaluaciones, reportes).',
          type: 'file',
          required: false,
          maxFiles: 8,
        },
      ],
    },
    {
      id: 'section_4',
      title: 'Diseño que enseña',
      questions: [
        {
          id: 's4_q1',
          prompt:
            '¿Cuáles son los principales fundamentos pedagógicos que respaldan el diseño de tu solución EdTech? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            {
              value: 'pedagogical_frameworks',
              label:
                'Uso de enfoques o marcos pedagógicos (aprendizaje basado en proyectos, gamificación, indagación, etc.).',
            },
            {
              value: 'learning_theories',
              label:
                'Referencia explícita a teorías del aprendizaje (constructivismo, aprendizaje social, experiencial).',
            },
            {
              value: 'internal_pedagogical_team',
              label: 'Equipo pedagógico interno especializado.',
            },
            {
              value: 'external_advisors',
              label:
                'Equipo técnico con experiencia educativa o consultores/asesores externos.',
            },
            {
              value: 'bibliography',
              label:
                'Bibliografía que orienta los contenidos y la metodología de la solución.',
            },
            {
              value: 'piloting',
              label:
                'Validación o pilotaje en contextos educativos reales.',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's4_q2',
          prompt:
            '¿La solución ofrece actividades en las que el/la aprendiz pueda construir conocimiento de forma activa? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'guided_inquiry', label: 'Exploración / indagación guiada' },
            { value: 'projects', label: 'Proyectos o tareas de desempeño' },
            {
              value: 'simulations',
              label: 'Simulaciones o laboratorios virtuales',
            },
            { value: 'creation_tools', label: 'Herramientas de creación' },
            { value: 'reflection', label: 'Espacios de reflexión / metacognición' },
            {
              value: 'structured_discussion',
              label: 'Discusión estructurada (foros, debate con roles, coevaluación)',
            },
            { value: 'none', label: 'Actualmente no incorpora estas actividades' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's4_q3',
          prompt:
            '¿Cómo asegura la solución una interfaz intuitiva? Proporcione ejemplos de mejoras o procesos de usabilidad continua.',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's4_q4',
          prompt:
            '¿Cómo usa la solución evidencia o insights sobre mejora de resultados para iterar la solución?',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's4_q5',
          prompt:
            '¿Cómo aseguran la calidad del contenido? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'expert_review', label: 'Revisión por expertos' },
            {
              value: 'standards_alignment',
              label: 'Alineación a estándares educativos',
            },
            { value: 'user_feedback', label: 'Incorporación de feedback de usuarios' },
            {
              value: 'research_based',
              label: 'Basado en investigación educativa actual',
            },
            { value: 'focus_groups', label: 'Grupos focales' },
            { value: 'qa_controls', label: 'QA con controles rigurosos' },
            { value: 'editorial_supervision', label: 'Supervisión editorial' },
            { value: 'licensed_sources', label: 'Fuentes licenciadas o acreditadas' },
            {
              value: 'linguistic_review',
              label: 'Revisión lingüística / gramatical profesional',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's4_q6',
          prompt:
            '¿El contenido incorpora contextos reales relevantes para el público objetivo?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'systematic', label: 'Sí, de forma sistemática' },
            { value: 'occasional', label: 'Sí, ocasionalmente' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's4_q7',
          prompt:
            '¿La solución recoge o activa conocimientos previos antes de introducir nuevos conceptos?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'automatic', label: 'Sí, de forma automática (diagnóstico breve)' },
            {
              value: 'teacher_support',
              label: 'Sí, con actividades o recordatorios para el/la docente',
            },
            {
              value: 'specific_modules',
              label: 'En módulos específicos u optativos',
            },
            { value: 'other', label: 'Otro', allowFreeText: true },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's4_q8',
          prompt: '¿Cuáles son los objetivos de aprendizaje de la solución?',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's4_q9',
          prompt:
            '¿Las evaluaciones se alinean con los objetivos de aprendizaje declarados?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'always', label: 'Siempre de forma trazable por objetivo' },
            { value: 'sometimes', label: 'Ocasionalmente' },
            { value: 'never', label: 'Nunca' },
          ],
        },
        {
          id: 's4_q10',
          prompt:
            '¿En qué puntos de la escala de Bloom ubicaría las actividades o evaluaciones de la solución? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'remember', label: 'Recordar' },
            { value: 'understand', label: 'Comprender' },
            { value: 'apply', label: 'Aplicar' },
            { value: 'analyze', label: 'Analizar' },
            { value: 'evaluate', label: 'Evaluar' },
            { value: 'create', label: 'Crear' },
            { value: 'not_applicable', label: 'No aplica' },
          ],
        },
        {
          id: 's4_q11',
          prompt:
            '¿La solución ofrece oportunidades de colaboración? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'cooperative', label: 'Actividades cooperativas o por roles' },
            { value: 'co_creation', label: 'Co-creación de productos / rúbricas de coevaluación' },
            { value: 'forums', label: 'Foros o chats moderados' },
            {
              value: 'integrations',
              label: 'Integración con herramientas externas (ej: LMS, foros)',
            },
            { value: 'none', label: 'No contempla colaboración' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's4_q12',
          prompt: '¿Qué aspectos se personalizan? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'scaffolding', label: 'Andamiaje (tipo y cantidad de ayuda)' },
            { value: 'content_types', label: 'Tipo de contenido o recursos' },
            { value: 'motivational_elements', label: 'Elementos motivacionales' },
            { value: 'practice_pace', label: 'Ritmo de práctica' },
            {
              value: 'graduated_support',
              label: 'Apoyos graduados para tareas de dificultad creciente',
            },
            {
              value: 'reduced_support',
              label: 'El nivel de apoyo se reduce progresivamente',
            },
            { value: 'not_applicable', label: 'No aplica' },
          ],
        },
        {
          id: 's4_q13',
          prompt:
            '¿Qué elementos motivacionales utiliza la solución? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'progress_tracking', label: 'Seguimiento de progreso / logros' },
            { value: 'reinforcement', label: 'Mensajes, sonidos de refuerzo o retos graduados' },
            { value: 'choice', label: 'Elección de rutas o recursos' },
            { value: 'none', label: 'No incluye elementos motivacionales' },
            {
              value: 'visibility',
              label: 'El usuario conoce su nivel de progreso',
            },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's4_q14',
          prompt:
            'Adjunta, si aplica: documentos pedagógicos, white papers del diseño pedagógico o demo de la solución.',
          type: 'file',
          required: false,
          maxFiles: 4,
        },
      ],
    },
    {
      id: 'section_5',
      title: 'Adaptabilidad',
      questions: [
        {
          id: 's5_q1',
          prompt: '¿Ha sido probada la solución en contextos geográficos específicos?',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's5_q2a',
          prompt:
            '¿La solución permite personalización de contenido por usuarios (p. ej., ajustes del docente para diferenciación)?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'yes', label: 'Sí' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          id: 's5_q2b',
          prompt:
            'Si la respuesta anterior es “Sí”, describa brevemente qué puede personalizar el docente/estudiante.',
          type: 'long_text',
          required: true,
          wordLimit: 100,
          dependsOn: {
            questionId: 's5_q2a',
            expectedAnswers: ['yes'],
          },
        },
        {
          id: 's5_q3',
          prompt:
            'Describa cómo se asegura contenido y experiencias apropiadas por edad (lenguaje, carga cognitiva, progresión).',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's5_q4',
          prompt:
            '¿Qué tipo de acompañamiento se lleva a cabo con los colegios/entornos educativos al integrar tu solución tecnológica? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'virtual_training', label: 'Capacitación inicial virtual para formadores' },
            { value: 'in_person_training', label: 'Capacitación inicial presencial para formadores' },
            { value: 'in_person_support', label: 'Acompañamiento pedagógico presencial' },
            {
              value: 'remote_support',
              label:
                'Acompañamiento pedagógico a distancia (chatbot, email, WhatsApp, llamadas)',
            },
            {
              value: 'technical_support',
              label:
                'Soporte técnico continuo a distancia (instalación, resolución de problemas, actualizaciones)',
            },
            {
              value: 'monitoring_channel',
              label:
                'Canal de monitoreo y retroalimentación sobre el uso de la herramienta',
            },
            {
              value: 'communities_of_practice',
              label:
                'Gestión de comunidades de práctica o espacios de intercambio entre docentes',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's5_q5',
          prompt: 'La herramienta tecnológica (selecciona todas las que apliquen):',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'offline_mode', label: 'Tiene una modalidad de uso offline' },
            {
              value: 'local_alignment',
              label: 'Puede personalizarse según políticas, estándares o currículos locales',
            },
            {
              value: 'accessibility',
              label: 'Puede integrar apoyos de accesibilidad (subtítulos, contraste, texto alternativo)',
            },
            {
              value: 'high_turnover_support',
              label:
                'Cuenta con soporte técnico y pedagógico para entornos con alta rotación de docentes',
            },
            {
              value: 'pedagogical_personalization',
              label: 'Ofrece personalización pedagógica según el avance del estudiante',
            },
            { value: 'none', label: 'Ninguno' },
          ],
        },
        {
          id: 's5_q6',
          prompt: 'Idiomas disponibles de la solución (selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'spanish', label: 'Español' },
            { value: 'english', label: 'Inglés' },
            { value: 'portuguese', label: 'Portugués' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's5_q7',
          prompt:
            '¿La solución está diseñada para apoyar específicamente a poblaciones desfavorecidas o marginadas? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'ethnic_minorities', label: 'Minorías étnicas' },
            { value: 'migrants', label: 'Migrantes' },
            { value: 'refugees', label: 'Refugiados' },
            { value: 'disability', label: 'Niños con discapacidad' },
            { value: 'out_of_school', label: 'Niños fuera del sistema escolar' },
            { value: 'girls', label: 'Niñas' },
            { value: 'lgbtqi_plus', label: 'LGBTQI+' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
      ],
    },
    {
      id: 'section_6',
      title: 'Escala con sentido',
      questions: [
        {
          id: 's6_q1',
          prompt: '¿En qué etapa de desarrollo se encuentra la solución?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'ideation', label: 'Ideación' },
            { value: 'functional_prototype', label: 'Prototipo funcional' },
            { value: 'early_revenue', label: 'Primeros ingresos' },
            { value: 'growth', label: 'Crecimiento' },
            { value: 'expansion', label: 'Expansión' },
          ],
        },
        {
          id: 's6_q2',
          prompt: '¿Cuál es el modelo de negocio de la solución? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'b2b', label: 'B2B' },
            { value: 'b2c', label: 'B2C' },
            { value: 'b2g', label: 'B2G' },
            { value: 'b2b2c', label: 'B2B2C' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's6_q3',
          prompt:
            '¿Cuál es el costo regular de la solución por usuario, contemplando un proyecto de ≥1.000 usuarios?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'gte_3_usd', label: '≥ USD 3 / mes' },
            { value: 'usd_1_2', label: 'USD 1 – 2' },
            { value: 'lte_1_usd', label: '≤ USD 1' },
          ],
        },
        {
          id: 's6_q4',
          prompt: '¿Cuál es el tiempo estándar de instalación/configuración de la solución?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'gt_2_months', label: 'Más de 2 meses' },
            { value: 'between_1_2_months', label: 'Entre 1 y 2 meses' },
            { value: 'lt_1_month', label: 'Menos de 1 mes' },
          ],
        },
        {
          id: 's6_q5',
          prompt:
            '¿Cuál es el tiempo estándar de capacitación para los usuarios principales de la solución?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'gt_2_months', label: 'Más de 2 meses' },
            { value: 'between_1_2_months', label: 'Entre 1 y 2 meses' },
            { value: 'lt_1_month', label: 'Menos de 1 mes' },
          ],
        },
        {
          id: 's6_q6',
          prompt:
            'La herramienta tecnológica es operable en (selecciona todas las que apliquen):',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'desktop', label: 'Desktop / laptop' },
            { value: 'tablet', label: 'Tablet' },
            { value: 'smartphone_android', label: 'Smartphone – Android' },
            { value: 'smartphone_ios', label: 'Smartphone – iOS' },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's6_q7',
          prompt: 'Requisito mínimo de conectividad efectiva por usuario:',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'offline', label: 'Offline' },
            { value: 'lt_256_kbps', label: '< 256 Kbps' },
            { value: 'between_256_512', label: '256 – 512 Kbps' },
            { value: 'between_512_1', label: '512 Kbps – 1 Mbps' },
            { value: 'between_1_2', label: '1 – 2 Mbps' },
            { value: 'between_2_5', label: '2 – 5 Mbps' },
            { value: 'gte_5', label: '≥ 5 Mbps' },
          ],
        },
        {
          id: 's6_q8',
          prompt: '¿Cuál es la facturación anual de tu organización?',
          type: 'single_choice',
          required: true,
          options: [
            { value: '0_50k', label: '0 – 50K' },
            { value: '50_100k', label: '50 – 100K' },
            { value: '100_300k', label: '100 – 300K' },
            { value: '300_600k', label: '300 – 600K' },
            { value: 'gte_600k', label: '≥ 600K' },
          ],
        },
        {
          id: 's6_q9',
          prompt: '¿Cuántos empleados componen la organización?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'founders_only', label: 'Founder(s)' },
            { value: '1_10', label: '1 – 10' },
            { value: '11_20', label: '11 – 20' },
            { value: '21_50', label: '21 – 50' },
            { value: '50_plus', label: '50+' },
          ],
        },
        {
          id: 's6_q10',
          prompt: '¿Cuántos meses de operación tiene tu organización?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'lt_18_months', label: 'Menos de 18 meses' },
            { value: 'between_18_36', label: 'Entre 18 y 36 meses' },
            { value: 'gt_37_months', label: 'Más de 37 meses' },
          ],
        },
        {
          id: 's6_q11',
          prompt: '¿En qué países opera actualmente tu solución?',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's6_q12',
          prompt: '¿Cuántos usuarios activos recurrentes mensuales tiene tu solución?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'lt_500', label: 'Menos de 500 usuarios' },
            { value: '500_1000', label: '500 – 1,000 usuarios' },
            { value: '1000_5000', label: '1,000 – 5,000 usuarios' },
            { value: '5001_10000', label: '5,001 – 10,000 usuarios' },
            { value: '10001_50000', label: '10,001 – 50,000 usuarios' },
            { value: '50001_100000', label: '50,001 – 100,000 usuarios' },
            { value: 'gt_100000', label: 'Más de 100,000 usuarios' },
          ],
        },
      ],
    },
    {
      id: 'section_7',
      title: 'Adopción',
      questions: [
        {
          id: 's7_q1',
          prompt:
            'Selecciona hasta 3 de los desafíos que con mayor frecuencia han enfrentado los colegios/entornos educativos al integrar tu solución.',
          type: 'multi_choice',
          required: true,
          maxSelections: 3,
          options: [
            {
              value: 'infrastructure',
              label: 'Acceso limitado a infraestructura, equipos o conectividad',
            },
            {
              value: 'curriculum_alignment',
              label: 'Dificultad de alineación con el currículo escolar',
            },
            {
              value: 'resistance',
              label:
                'Resistencia al cambio por parte de formadores y/o familias (baja disposición para capacitarse y usar la solución)',
            },
            {
              value: 'financial_costs',
              label: 'Costos de adquisición y/o sostenibilidad financiera',
            },
            {
              value: 'digital_skills',
              label: 'Necesidad de generar capacidades digitales en la comunidad educativa',
            },
            {
              value: 'lack_champions',
              label: 'Falta de multiplicadores/promotores internos que impulsen la tecnología',
            },
            {
              value: 'slow_procurement',
              label: 'Ciclos de compra lentos y burocráticos',
            },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro', allowFreeText: true },
          ],
        },
        {
          id: 's7_q2',
          prompt: '¿Cuál fue la tasa de renovación de contratos en los últimos 12 meses?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'lt_50', label: '< 50%' },
            { value: '50_69', label: '50 – 69%' },
            { value: '70_84', label: '70 – 84%' },
            { value: 'gte_85', label: '≥ 85%' },
            { value: 'not_applicable', label: 'No aplica' },
          ],
        },
        {
          id: 's7_q3',
          prompt:
            '¿Cuál es la tasa promedio de abandono de usuarios (churn) y método de cálculo? (No se publica)',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's7_q4',
          prompt: '¿Cuál es la tasa de usabilidad mensual promedio de tus usuarios activos?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'lt_40', label: '< 40%' },
            { value: '40_59', label: '40 – 59%' },
            { value: '60_79', label: '60 – 79%' },
            { value: 'gte_80', label: '≥ 80%' },
            { value: 'not_measured', label: 'No medido' },
          ],
        },
        {
          id: 's7_q5',
          prompt: '¿Cuál es el NPS de tus usuarios recurrentes y método de cálculo?',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's7_q6',
          prompt:
            '¿Identificas riesgos habituales que afectan la adopción de la solución, y para los cuales la empresa cuenta con planes de mitigación?',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
      ],
    },
  ],
};


