const Loading = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text = ''
}) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const colors = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-400'
  }

  const Spinner = () => (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <Spinner />
        {text && (
          <p className="mt-4 text-gray-600 font-medium">{text}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Spinner />
      {text && (
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      )}
    </div>
  )
}

// Skeleton para carregamento de conteudo
export const Skeleton = ({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = ''
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={{ width, height }}
    />
  )
}

// Card skeleton
export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm">
    <div className="flex items-start gap-4">
      <Skeleton width="48px" height="48px" rounded="xl" />
      <div className="flex-1">
        <Skeleton width="60%" height="1rem" className="mb-2" />
        <Skeleton width="40%" height="1.5rem" className="mb-2" />
        <Skeleton width="30%" height="0.875rem" />
      </div>
    </div>
  </div>
)

// Lista skeleton
export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

export default Loading
