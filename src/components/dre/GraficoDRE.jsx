import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const CORES = {
  cmv: '#EF4444',
  impostos: '#F59E0B',
  custosFixos: '#8B5CF6',
  lucro: '#10B981',
  prejuizo: '#DC2626'
}

const GraficoDRE = ({ dre }) => {
  // Se nao tem faturamento, mostrar mensagem
  if (dre.faturamentoBruto === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400">
        Sem vendas no periodo
      </div>
    )
  }

  // Dados para o grafico
  const dados = [
    {
      name: 'CMV',
      value: dre.cmv,
      percent: dre.cmvPercent,
      color: CORES.cmv
    },
    {
      name: 'Impostos',
      value: dre.impostoSimples + dre.taxaCartao,
      percent: ((dre.impostoSimples + dre.taxaCartao) / dre.faturamentoBruto) * 100,
      color: CORES.impostos
    },
    {
      name: 'Custos Fixos',
      value: dre.totalCustosFixos,
      percent: dre.totalCustosFixosPercent,
      color: CORES.custosFixos
    },
    {
      name: dre.lucroOperacional >= 0 ? 'Lucro' : 'Prejuizo',
      value: Math.abs(dre.lucroOperacional),
      percent: Math.abs(dre.lucroOperacionalPercent),
      color: dre.lucroOperacional >= 0 ? CORES.lucro : CORES.prejuizo
    }
  ].filter(d => d.value > 0)

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // Nao mostrar label se for muito pequeno

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda customizada */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {dados.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">{item.name}</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GraficoDRE
