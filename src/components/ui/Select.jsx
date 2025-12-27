import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({
  label,
  options = [],
  error,
  helper,
  placeholder = 'Selecione...',
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl
            border-2 transition-colors duration-200
            text-gray-900 bg-white
            text-base appearance-none
            focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error
              ? 'border-danger focus:border-danger'
              : 'border-gray-200 focus:border-primary-500'
            }
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown size={20} />
        </div>
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

Select.displayName = 'Select'

// Botoes de selecao (para formas de pagamento, etc)
export const SelectButtons = ({
  label,
  options = [],
  value,
  onChange,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex-1 py-3 px-4 rounded-xl
                border-2 transition-all duration-200
                flex items-center justify-center gap-2
                font-medium
                ${isSelected
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              {Icon && <Icon size={20} />}
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  )
}

export default Select
