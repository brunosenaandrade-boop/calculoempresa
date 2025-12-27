import { forwardRef } from 'react'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:bg-primary-100',
  danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  success: 'bg-success text-white hover:bg-emerald-600 active:bg-emerald-700'
}

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
  icon: 'p-3'
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = `
    font-medium rounded-xl
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
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
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={20} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={20} />}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
