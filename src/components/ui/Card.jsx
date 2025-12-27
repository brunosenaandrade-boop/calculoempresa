const Card = ({
  children,
  className = '',
  padding = 'md',
  onClick,
  hoverable = false,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-sm
        ${paddings[padding]}
        ${hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Header
Card.Header = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
)

// Card Title
Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
)

// Card Content
Card.Content = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

// Card Footer
Card.Footer = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
)

// Stat Card (para dashboard)
Card.Stat = ({ title, value, subtitle, icon: Icon, color = 'primary', trend }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600'
  }

  return (
    <Card className="flex items-start gap-4">
      {Icon && (
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-sm mt-1 ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
            {trend >= 0 ? '+' : ''}{trend}% vs anterior
          </p>
        )}
      </div>
    </Card>
  )
}

export default Card
