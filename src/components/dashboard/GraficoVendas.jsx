import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { CORES_GRAFICO } from '../../utils/constants'

const GraficoVendas = ({ dados }) => {
  const maxValue = Math.max(...dados.map((d) => d.total), 1)

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="diaSemana"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            width={40}
          />
          <Bar
            dataKey="total"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          >
            {dados.map((entry, index) => {
              const isToday = index === dados.length - 1
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isToday ? CORES_GRAFICO.primaria : CORES_GRAFICO.secundaria}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoVendas
