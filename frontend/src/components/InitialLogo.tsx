interface InitialLogoProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function InitialLogo({ name, size = 'md', className = '' }: InitialLogoProps) {
  // Obtener la primera letra del nombre, limpiando "EdTech", "Colombia", etc.
  const cleanName = name
    .replace(/\b(EdTech|Colombia|de|para|y|con)\b/gi, '')
    .trim()
    .split(' ')[0]
  
  const initial = cleanName.charAt(0).toUpperCase()
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl'
  }
  
  // Generar un color basado en la inicial para consistencia
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#8B5CF6', // purple
    '#F59E0B', // orange
    '#EF4444', // red
    '#06B6D4', // cyan
    '#EC4899', // pink
    '#6366F1', // indigo
  ]
  
  const colorIndex = initial.charCodeAt(0) % colors.length
  const backgroundColor = colors[colorIndex]
  
  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold text-white shadow-md ${className}`}
      style={{ backgroundColor }}
    >
      {initial}
    </div>
  )
}

