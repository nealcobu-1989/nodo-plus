// Reutilizamos los tipos de profileSurvey
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
  groupWith?: string[]; // IDs de preguntas que se agrupan visualmente
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

export type InstitutionSurvey = {
  intro: {
    title: string;
    description: string;
    consent: ConsentItem[];
  };
  sections: SurveySection[];
};

// Escala Likert estándar
const likertScale: ChoiceOption[] = [
  { value: 'totally_disagree', label: 'Totalmente en desacuerdo' },
  { value: 'disagree', label: 'En desacuerdo' },
  { value: 'neutral', label: 'Me es indiferente' },
  { value: 'agree', label: 'De acuerdo' },
  { value: 'totally_agree', label: 'Totalmente de acuerdo' },
];

// Escala de frecuencia
const frequencyScale: ChoiceOption[] = [
  { value: 'never', label: 'Nunca' },
  { value: 'once_year', label: 'Una vez al año' },
  { value: 'quarterly', label: 'Trimestralmente' },
  { value: 'monthly', label: 'Mensualmente' },
  { value: 'weekly', label: 'Semanalmente' },
  { value: 'daily', label: 'Diariamente' },
  { value: 'other', label: 'Otra (especificar)', allowFreeText: true },
];

// Escala de porcentajes
const percentageScale: ChoiceOption[] = [
  { value: '0_25', label: '0–25%' },
  { value: '26_50', label: '26–50%' },
  { value: '51_75', label: '51–75%' },
  { value: '76_100', label: '76–100%' },
];

export const institutionSurvey: InstitutionSurvey = {
  intro: {
    title: 'Radiografía de Comunidades Educativas',
    description:
      'Este formulario permite caracterizar tu institución educativa, identificando fortalezas, necesidades y oportunidades para la integración de tecnologías educativas. La información recopilada será utilizada para generar recomendaciones personalizadas y facilitar la conexión con soluciones EdTech pertinentes.',
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
      title: 'Información de la Comunidad Educativa',
      questions: [
        {
          id: 's1_q1',
          prompt: 'Nombre de la institución/programa educativo',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q2',
          prompt: 'Municipio, ciudad y departamento',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q3',
          prompt: 'Naturaleza de la institución/programa educativo',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'private', label: 'Privada' },
            { value: 'public', label: 'Pública' },
            { value: 'other', label: 'Otra', allowFreeText: true },
          ],
        },
        {
          id: 's1_q4',
          prompt: 'Tamaño de su población objetivo (ó matrícula total), por nivel educativo',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          helpText: 'Ingrese el número aproximado de estudiantes por nivel educativo',
          groupWith: ['s1_q4_early_childhood', 's1_q4_primary', 's1_q4_lower_secondary', 's1_q4_upper_secondary', 's1_q4_tvet', 's1_q4_tertiary', 's1_q4_non_formal', 's1_q4_reskilling'],
        },
        {
          id: 's1_q4_early_childhood',
          prompt: 'Primera infancia',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q4_primary',
          prompt: 'Educación Primaria',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q4_lower_secondary',
          prompt: 'Secundaria Baja',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q4_upper_secondary',
          prompt: 'Secundaria Alta',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q4_tvet',
          prompt: 'Educación y Formación Técnica y Profesional',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q4_tertiary',
          prompt: 'Educación Terciaria',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q4_non_formal',
          prompt: 'Educación no formal',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q4_reskilling',
          prompt: 'Recualificación/Capacitación laboral',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s1_q4'],
        },
        {
          id: 's1_q5',
          prompt: 'Nombre de contacto',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
        {
          id: 's1_q6',
          prompt: 'Correo de contacto',
          type: 'short_text',
          required: true,
          wordLimit: 25,
        },
      ],
    },
    {
      id: 'section_2',
      title: 'Prioridades pedagógicas y población objetivo',
      questions: [
        {
          id: 's2_q1',
          prompt: '¿Cuáles son los objetivos principales (2 ó 3) de aprendizaje o gestión que su institución/programa estaría priorizando en los próximos 12 meses?',
          type: 'long_text',
          required: true,
          wordLimit: 100,
        },
        {
          id: 's2_q2',
          prompt: 'Del siguiente listado, ¿cuál es el área o competencia prioritaria que su institución/programa necesita fortalecer en los próximos 12 meses para mejorar la calidad de los aprendizajes de su población objetivo?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'literacy', label: 'Lectoescritura (leer y escribir)' },
            { value: 'math', label: 'Matemáticas' },
            { value: 'stem', label: 'Ciencias/STEM (ciencias, tecnología, ingeniería)' },
            { value: 'languages', label: 'Inglés / otros idiomas' },
            { value: 'sel', label: 'Habilidades socioemocionales (SEL)' },
            { value: 'digital_skills', label: 'Competencias digitales' },
            { value: 'computational_thinking', label: 'Pensamiento computacional' },
            { value: 'social_sciences', label: 'Historia / Ciencias sociales' },
            { value: 'other', label: 'Otra (especificar)', allowFreeText: true },
          ],
        },
        {
          id: 's2_q2b',
          prompt: 'Si manejan más de una prioridad, relacione hasta 3 áreas/competencias, según el orden de prioridad (1 = más urgente)',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          helpText: 'Primera prioridad adicional (opcional)',
          groupWith: ['s2_q2b_2', 's2_q2b_3'],
        },
        {
          id: 's2_q2b_2',
          prompt: 'Segunda prioridad adicional (opcional)',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s2_q2b'],
        },
        {
          id: 's2_q2b_3',
          prompt: 'Tercera prioridad adicional (opcional)',
          type: 'short_text',
          required: false,
          wordLimit: 25,
          groupWith: ['s2_q2b'],
        },
        {
          id: 's2_q3',
          prompt: '¿Quién sería el usuario y propósito principal de una intervención apoyada en tecnología para mejorar la calidad de los aprendizajes? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            {
              value: 'teachers_capabilities',
              label: 'Docentes - fortalecer sus capacidades, apoyar la planeación de clases y/o la evaluación, y/o ayudar a reducir carga administrativa',
            },
            {
              value: 'teachers_in_class',
              label: 'Uso del docente en aula - permitir lecciones interactivas, con contenido digital, diseñadas para entornos uno-a-muchos.',
            },
            {
              value: 'students',
              label: 'Estudiantes - aprendizaje personalizado y a ritmo diferenciado, ya sea de manera independiente o con apoyo del docente.',
            },
            {
              value: 'families',
              label: 'Familias/padres – informarlas y vincularlas, apoyando el aprendizaje más allá del aula.',
            },
            {
              value: 'leadership',
              label: 'Para equipos de liderazgo y gestión escolar',
            },
            { value: 'other', label: 'Otra (especificar)', allowFreeText: true },
          ],
        },
      ],
    },
    {
      id: 'section_3',
      title: 'Liderazgo escolar para la transición digital',
      questions: [
        {
          id: 's3_q1',
          prompt: '¿Con qué frecuencia el equipo de liderazgo utiliza tecnología en sus tareas diarias?',
          type: 'single_choice',
          required: true,
          options: frequencyScale,
        },
        {
          id: 's3_q2',
          prompt: '¿Con qué frecuencia la institución/programa provee formaciones sobre uso de tecnología a los equipos de liderazgo?',
          type: 'single_choice',
          required: true,
          options: frequencyScale.slice(0, 5), // Sin "Otra"
        },
        {
          id: 's3_q3',
          prompt: '¿Con qué frecuencia la institución/programa prioriza formaciones a docentes/formadores sobre uso pedagógico de tecnología educativa?',
          type: 'single_choice',
          required: true,
          options: frequencyScale.slice(0, 5), // Sin "Otra"
        },
        {
          id: 's3_q4',
          prompt: 'Como líder educativo, ¿busca activamente ser parte de una red o comunidad de liderazgo digital?',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's3_q5',
          prompt: 'Como líder educativo, ¿está familiarizado/a con herramientas de IA educativas?',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's3_q6',
          prompt: 'Como líder educativo, ¿promueve y busca activamente oportunidades de formación en liderazgo digital?',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
      ],
    },
    {
      id: 'section_4',
      title: 'Cultura Institucional',
      description: 'Seleccione el enunciado con el que más se identifica en relación a cada una de las siguientes afirmaciones.',
      questions: [
        {
          id: 's4_q1',
          prompt: 'Me siento seguro/a utilizando herramientas tecnológicas',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's4_q2',
          prompt: 'Estoy dispuesto/a a seguir incorporando nuevas herramientas tecnológicas en la gestión y enseñanza de mi institución/programa.',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's4_q3',
          prompt: 'Percibo que el uso de herramientas tecnológicas mejora la gestión y el logro de aprendizajes en mi institución/programa.',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's4_q4',
          prompt: 'Considero que las herramientas tecnológicas disponibles en mi institución son fáciles de aprender y utilizar.',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's4_q5',
          prompt: 'Considero que las herramientas tecnológicas disponibles en mi institución son suficientes.',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's4_q6',
          prompt: 'La mayoría de los docentes/formadores de la institución/programa utilizan con agrado la tecnología.',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's4_q7',
          prompt: 'La comunidad educativa (directivos, docentes/formadores) promueve el uso de metodologías activas con apoyo de tecnologías.',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'not_promoted', label: 'No se promueven estas metodologías con tecnología' },
            { value: 'occasional', label: 'Se promueven de manera ocasional, sin un plan definido' },
            { value: 'frequent_individual', label: 'Se promueven de forma frecuente, pero de manera individual y no sistemática' },
            { value: 'planned', label: 'Se promueven de forma planificada, con acciones y recursos específicos' },
            { value: 'institutionalized', label: 'Se promueven de forma institucionalizada, con estrategias, formación y seguimiento continuo' },
          ],
        },
        {
          id: 's4_q8',
          prompt: 'En el colegio se garantizan comunidades de aprendizaje para compartir ideas y aprender con otros docentes sobre el uso pedagógico de tecnologías.',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
      ],
    },
    {
      id: 'section_5',
      title: 'Sistemas y Gestión de Datos',
      questions: [
        {
          id: 's5_q1',
          prompt: 'Los sistemas de gestión de nuestra institución/programa son suficientes y adecuados para apoyar la eficiencia y efectividad de procesos de gestión escolar.',
          type: 'single_choice',
          required: true,
          options: likertScale,
        },
        {
          id: 's5_q2',
          prompt: 'En nuestra institución/programa utilizamos tecnología para tomar decisiones administrativas y de planeación basadas en datos.',
          type: 'single_choice',
          required: true,
          options: frequencyScale,
        },
        {
          id: 's5_q3',
          prompt: '¿Qué tipo de herramientas digitales o plataformas educativas utiliza la institución/programa para apoyar la gestión administrativa?',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'financial', label: 'Sistema de gestión financiera/contable' },
            { value: 'hr', label: 'Sistema de gestión de recursos humanos (nómina, personal)' },
            { value: 'infrastructure', label: 'Sistema de gestión de infraestructura y mantenimiento' },
            { value: 'attendance', label: 'Sistema de control de asistencia del personal' },
            { value: 'enrollment', label: 'Sistema de gestión de matrículas y admisiones' },
            { value: 'other', label: 'Otra (especificar)', allowFreeText: true },
          ],
        },
        {
          id: 's5_q4',
          prompt: '¿Se utilizan datos y herramientas digitales para tomar decisiones pedagógicas o curriculares?',
          type: 'single_choice',
          required: true,
          options: frequencyScale,
        },
        {
          id: 's5_q5',
          prompt: '¿Qué tipo de herramientas digitales o plataformas educativas utiliza la institución para apoyar la gestión académica? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'school_management', label: 'Sistemas de gestión escolar con módulo académico' },
            { value: 'attendance_grades', label: 'Registro digital de asistencia y calificaciones' },
            { value: 'teacher_assignment', label: 'Registro de asignación de docentes por área, carga laboral y grupo de estudiantes asociados' },
            { value: 'other', label: 'Otra (especificar)', allowFreeText: true },
          ],
        },
      ],
    },
    {
      id: 'section_6',
      title: 'Competencias docentes y uso pedagógico',
      questions: [
        {
          id: 's6_q1',
          prompt: '¿Qué metodologías activas con apoyo de TIC se implementan actualmente en la institución? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'pbl', label: 'Aprendizaje Basado en Proyectos (ABP) con uso de TIC' },
            { value: 'flipped', label: 'Aula invertida (flipped classroom)' },
            { value: 'challenge_based', label: 'Aprendizaje basado en retos o problemas con uso de TIC' },
            { value: 'gamification', label: 'Gamificación y aprendizaje basado en juegos digitales' },
            { value: 'collaborative', label: 'Aprendizaje colaborativo en entornos virtuales' },
            { value: 'simulations', label: 'Simulaciones o laboratorios virtuales' },
            { value: 'adaptive', label: 'Aprendizaje adaptativo o personalizado mediante plataformas digitales' },
            { value: 'ar_vr', label: 'Realidad aumentada o realidad virtual en actividades de aula' },
            { value: 'multimedia_creation', label: 'Creación de contenidos multimedia por parte de los estudiantes' },
            { value: 'other', label: 'Otro (especificar)', allowFreeText: true },
            { value: 'none', label: 'Ninguno' },
          ],
        },
        {
          id: 's6_q2',
          prompt: '¿Qué porcentaje aproximado de su cuerpo docente ha recibido formación específica en tecnología educativa en los últimos 12 meses?',
          type: 'single_choice',
          required: true,
          options: percentageScale,
        },
        {
          id: 's6_q3',
          prompt: '¿Qué porcentaje aproximado de su cuerpo docente utiliza regularmente en su práctica metodologías activas con apoyo de tecnología?',
          type: 'single_choice',
          required: true,
          options: percentageScale,
        },
        {
          id: 's6_q4',
          prompt: '¿Los docentes/formadores utilizan algunas de las siguientes herramientas digitales o plataformas educativas para apoyar la enseñanza y el aprendizaje? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'lms', label: 'Plataformas de gestión de aprendizaje (LMS) – ej. Moodle, Google Classroom, Canvas' },
            { value: 'content_platforms', label: 'Plataformas de contenidos digitales – ej. Khan Academy, Britannica School, Matific' },
            { value: 'videoconference', label: 'Herramientas para clases en línea / videoconferencia – ej. Zoom, Microsoft Teams, Meet' },
            { value: 'authoring', label: 'Herramientas de autor y creación de contenidos – ej. Genially, Canva, H5P' },
            { value: 'other', label: 'Otro (especificar)', allowFreeText: true },
          ],
        },
        {
          id: 's6_q5',
          prompt: '¿Los docentes/formadores utilizan algunas de las siguientes herramientas digitales o plataformas educativas para apoyar el proceso de evaluación y el seguimiento al aprendizaje? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'quiz_platforms', label: 'Plataformas de verificación de aprendizajes en línea – ej. Kahoot!, Quizizz, Socrative' },
            { value: 'learning_analytics', label: 'Herramientas de análisis de datos de aprendizaje (learning analytics)' },
            { value: 'progress_tracking', label: 'Sistemas de seguimiento de progreso individual' },
            { value: 'other', label: 'Otro (especificar)', allowFreeText: true },
          ],
        },
      ],
    },
    {
      id: 'section_7',
      title: 'Infraestructura Tecnológica',
      questions: [
        {
          id: 's7_q1',
          prompt: 'En el entorno educativo (institución/centro digital) hay acceso regular a electricidad.',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'stable', label: 'Sí, es estable y está disponible todo el día' },
            { value: 'partial', label: 'Parcial, falla o es intermitente' },
            { value: 'unstable', label: 'No, presentan fallas frecuentes o está ausente' },
          ],
        },
        {
          id: 's7_q2',
          prompt: '¿Cuál es el ancho de banda actual de la conexión a internet del entorno educativo (institución/centro digital)?',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'lt_10', label: 'Menos de 10 Mbps' },
            { value: '10_50', label: 'Entre 10 y 50 Mbps' },
            { value: '51_100', label: 'Entre 51 y 100 Mbps' },
            { value: 'gt_100', label: 'Más de 100 Mbps' },
          ],
        },
        {
          id: 's7_q3',
          prompt: '¿En qué espacios del centro digital/educativo hay acceso a Wi-Fi?',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'admin_offices', label: 'Solo en oficinas administrativas' },
            { value: 'library', label: 'Biblioteca' },
            { value: 'computer_lab', label: 'Sala de Informática' },
            { value: 'some_classrooms', label: 'Algunas aulas' },
            { value: 'all_classrooms', label: 'Todas las aulas' },
            { value: 'none', label: 'En ningún espacio hay wifi' },
            { value: 'other', label: 'Otro (especificar)', allowFreeText: true },
          ],
        },
        {
          id: 's7_q4',
          prompt: '¿Qué tipo de dispositivos suelen usar principalmente los estudiantes y docentes/formadores para acceder a herramientas tecnológicas en la institución/programa? (Selecciona todas las que apliquen)',
          type: 'multi_choice',
          required: true,
          options: [
            { value: 'desktop_laptop', label: 'Computador de escritorio / portátil' },
            { value: 'tablet', label: 'Tableta' },
            { value: 'android', label: 'Teléfono inteligente – Android' },
            { value: 'ios', label: 'Teléfono inteligente – iOS' },
            { value: 'none', label: 'Ninguno' },
            { value: 'other', label: 'Otro (especificar)', allowFreeText: true },
          ],
        },
        {
          id: 's7_q5',
          prompt: '¿Cuál es la proporción de equipos de cómputo funcionales disponibles para uso pedagógico en su institución/programa? Incluya computadores de escritorio, portátiles o tabletas que puedan usarse regularmente con propósitos pedagógicos.',
          type: 'single_choice',
          required: true,
          options: [
            { value: 'lt_0_1', label: 'Menos de 1 equipo por cada 10 usuarios/estudiantes (ratio < 0,1)' },
            { value: '0_1_0_2', label: 'Entre 1 equipo por cada 10 y 1 equipo por cada 5 usuarios/estudiantes (0,1 – 0,2)' },
            { value: '0_2_0_33', label: 'Entre 1 equipo por cada 5 y 1 equipo por cada 3 usuarios/estudiantes (0,2 – 0,33)' },
            { value: '0_33_0_5', label: 'Entre 1 equipo por cada 3 y 1 equipo por cada 2 usuarios/estudiantes (0,33 – 0,5)' },
            { value: 'gte_1_0', label: '1 equipo por cada usuario/estudiante o más (ratio ≥ 1,0)' },
          ],
        },
        {
          id: 's7_q6',
          prompt: 'En su institución/programa ¿qué proporción de los dispositivos tecnológicos funcionan correctamente (no están en estado de obsolescencia)?',
          type: 'single_choice',
          required: true,
          options: percentageScale,
        },
      ],
    },
  ],
};

