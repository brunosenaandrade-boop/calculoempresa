import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import TabelaDRE from '../components/dre/TabelaDRE'
import GraficoDRE from '../components/dre/GraficoDRE'
import { useData } from '../contexts/DataContext'
import { useTutorial } from '../contexts/TutorialContext'
import { useDRE } from '../hooks/useDRE'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { MESES } from '../utils/constants'

const DRE = () => {
  const { loading } = useData()
  const { shouldShowTutorial, startTutorial } = useTutorial()

  // Mes e ano selecionado
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)

  // Dados do DRE
  const { dre, vendasMes } = useDRE(ano, mes)

  // Tutorial
  useEffect(() => {
    if (!loading && shouldShowTutorial('dre')) {
      const timer = setTimeout(() => startTutorial('dre'), 500)
      return () => clearTimeout(timer)
    }
  }, [loading, shouldShowTutorial, startTutorial])

  const mudarMes = (delta) => {
    let novoMes = mes + delta
    let novoAno = ano

    if (novoMes > 12) {
      novoMes = 1
      novoAno++
    } else if (novoMes < 1) {
      novoMes = 12
      novoAno--
    }

    setMes(novoMes)
    setAno(novoAno)
  }

  const isAtual = ano === hoje.getFullYear() && mes === hoje.getMonth() + 1

  // Determinar cor do resultado
  const getResultadoInfo = () => {
    if (dre.lucroOperacional > 0) {
      return {
        color: 'text-success',
        bgColor: 'bg-success/10',
        icon: TrendingUp,
        label: 'Lucro'
      }
    } else if (dre.lucroOperacional < 0) {
      return {
        color: 'text-danger',
        bgColor: 'bg-danger/10',
        icon: TrendingDown,
        label: 'Prejuizo'
      }
    }
    return {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: Target,
      label: 'Equilibrio'
    }
  }

  const resultadoInfo = getResultadoInfo()
  const ResultadoIcon = resultadoInfo.icon

  return (
    <PageContainer>
      {/* Seletor de mes */}
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => mudarMes(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="text-center">
            <p className="font-semibold text-lg text-gray-900">
              {MESES[mes - 1]} {ano}
            </p>
            <p className="text-sm text-gray-500">
              {vendasMes.length} vendas no periodo
            </p>
          </div>

          <button
            onClick={() => mudarMes(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={isAtual}
          >
            <ChevronRight size={24} className={isAtual ? 'text-gray-300' : ''} />
          </button>
        </div>
      </Card>

      {/* Card resultado principal */}
      <div data-tutorial="resultado-mes">
        <Card className={`mb-4 ${resultadoInfo.bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{resultadoInfo.label} Operacional</p>
              <p className={`text-3xl font-bold ${resultadoInfo.color}`}>
                {formatCurrency(Math.abs(dre.lucroOperacional))}
              </p>
              <p className={`text-sm ${resultadoInfo.color}`}>
                {formatPercent(Math.abs(dre.lucroOperacionalPercent))} do faturamento
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${resultadoInfo.bgColor}`}>
              <ResultadoIcon size={40} className={resultadoInfo.color} />
            </div>
          </div>
        </Card>
      </div>

      {/* Grafico visual */}
      <Card className="mb-4">
        <Card.Header>
          <Card.Title>Composicao</Card.Title>
        </Card.Header>
        <GraficoDRE dre={dre} />
      </Card>

      {/* Tabela DRE */}
      <div data-tutorial="tabela-dre">
        <Card className="mb-4">
          <Card.Header>
            <Card.Title>Demonstrativo de Resultado</Card.Title>
          </Card.Header>
          <TabelaDRE dre={dre} />
        </Card>
      </div>

      {/* Indicadores */}
      <div data-tutorial="cores-indicadores">
        <Card>
          <Card.Header>
            <Card.Title>Indicadores</Card.Title>
          </Card.Header>

          <div className="space-y-4">
            {/* Ponto de Equilibrio */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Ponto de Equilibrio</p>
                  <p className="text-xs text-gray-500">Vendas minimas para nao ter prejuizo</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">
                {formatCurrency(dre.pontoEquilibrio)}
              </p>
            </div>

            {/* Meta com lucro */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-success" />
                <div>
                  <p className="font-medium text-gray-900">Meta com Lucro</p>
                  <p className="text-xs text-gray-500">Para atingir lucro desejado</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">
                {formatCurrency(dre.pontoEquilibrioComLucro)}
              </p>
            </div>

            {/* Ticket Medio */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-warning" />
                <div>
                  <p className="font-medium text-gray-900">Ticket Medio</p>
                  <p className="text-xs text-gray-500">Valor medio por venda</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">
                {formatCurrency(dre.ticketMedio)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

export default DRE
