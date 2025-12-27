const PageContainer = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`
      flex-1 pb-20
      ${noPadding ? '' : 'px-4 pt-4'}
      ${className}
    `}>
      {/* Header da pagina */}
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-2xl font-bold text-gray-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div>
              {action}
            </div>
          )}
        </div>
      )}

      {/* Conteudo */}
      {children}
    </div>
  )
}

// Secao dentro da pagina
PageContainer.Section = ({ title, children, className = '', action }) => (
  <section className={`mb-6 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-3">
        {title && (
          <h3 className="text-lg font-semibold text-gray-800">
            {title}
          </h3>
        )}
        {action}
      </div>
    )}
    {children}
  </section>
)

// Lista vazia
PageContainer.Empty = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && (
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    {description && (
      <p className="text-gray-500 mb-4 max-w-sm">
        {description}
      </p>
    )}
    {action}
  </div>
)

export default PageContainer
