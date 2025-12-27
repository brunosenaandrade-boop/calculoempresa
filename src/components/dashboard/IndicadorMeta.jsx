import { Target, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const IndicadorMeta = ({ valor, meta, percentual }) => {
  const atingiuMeta = percentual >= 100
  const quaseAtingiu = percentual >= 80 && percentual < 100
  const baixo = percentual < 50

  const getColor = () => {
    if (atingiuMeta) return 'text-success'
    if (quaseAtingiu) return 'text-warning'
    if (baixo) return 'text-danger'
    return 'text-primary-600'
  }

  const getBgColor = () => {
    if (atingiuMeta) return 'bg-success'
    if (quaseAtingiu) return 'bg-warning'
    if (baixo) return 'bg-danger'
    return 'bg-primary-600'
  }

  const getIcon = () => {
    if (atingiuMeta) return TrendingUp
    if (baixo) return TrendingDown
    return Target
  }

  const Icon = getIcon()

  return (
    <Card className="relative overflow-hidden">
      {/* Fundo decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -mr-16 -mt-16 opacity-50" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Vendas de Hoje</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(valor)}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${getBgColor()} bg-opacity-20`}>
            <Icon size={28} className={getColor()} />
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-2">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBgColor()}`}
              style={{ width: `${Math.min(percentual, 100)}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm">
          <span className={`font-semibold ${getColor()}`}>
            {formatPercent(percentual)} da meta
          </span>
          <span className="text-gray-400">
            Meta: {formatCurrency(meta)}
          </span>
        </div>

        {/* Mensagem motivacional */}
        {atingiuMeta && (
          <p className="mt-3 text-sm text-success font-medium text-center bg-success/10 py-2 rounded-lg">
            Parabens! Meta atingida!
          </p>
        )}
      </div>
    </Card>
  )
}

export default IndicadorMeta
