interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        bg-gradient-to-br from-primary-600 to-navy-700 
        text-white 
        rounded-xl 
        font-bold 
        flex items-center justify-center
        shadow-lg
        transition-transform hover:scale-105
      `}>
        N<span className="text-primary-300">+</span>
      </div>
    </div>
  )
}

