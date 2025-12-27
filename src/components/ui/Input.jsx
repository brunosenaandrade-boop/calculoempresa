import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(({
  label,
  error,
  helper,
  icon: Icon,
  type = 'text',
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  prefix,
  suffix,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}

        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl
            border-2 transition-colors duration-200
            text-gray-900 placeholder-gray-400
            text-base
            focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${Icon ? 'pl-11' : ''}
            ${prefix ? 'pl-12' : ''}
            ${suffix || isPassword ? 'pr-11' : ''}
            ${error
              ? 'border-danger focus:border-danger'
              : 'border-gray-200 focus:border-primary-500'
            }
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {suffix && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}

      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Input para valores monetarios
export const CurrencyInput = forwardRef(({ value, onChange, ...props }, ref) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    val = (parseInt(val) / 100).toFixed(2)
    if (isNaN(val)) val = '0.00'
    onChange?.(parseFloat(val))
  }

  const displayValue = value
    ? new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    : ''

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      prefix="R$"
      value={displayValue}
      onChange={handleChange}
      {...props}
    />
  )
})

CurrencyInput.displayName = 'CurrencyInput'

// Input para numeros
export const NumberInput = forwardRef(({ value, onChange, min, max, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const val = parseFloat(e.target.value) || 0
    if (min !== undefined && val < min) return
    if (max !== undefined && val > max) return
    onChange?.(val)
  }

  return (
    <Input
      ref={ref}
      type="number"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  )
})

NumberInput.displayName = 'NumberInput'

export default Input
