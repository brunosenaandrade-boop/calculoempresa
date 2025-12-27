import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, TrendingUp, ShoppingCart, Target } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'
import ResumoCards from '../components/dashboard/ResumoCards'
import GraficoVendas from '../components/dashboard/GraficoVendas'
import IndicadorMeta from '../components/dashboard/IndicadorMeta'
import { useData } from '../contexts/DataContext'
import { useTutorial } from '../contexts/TutorialContext'
import { useResumoDia, useVendasPeriodo } from '../hooks/useDRE'
import { formatDateLong } from '../utils/formatters'

const Dashboard = () => {
  const navigate = useNavigate()
  const { loading, configuracoes } = useData()
  const { shouldShowTutorial, startTutorial } = useTutorial()

  const hoje = new Date().toISOString().split('T')[0]
  const { resumo } = useResumoDia(hoje)
  const { dadosGrafico } = useVendasPeriodo(7)

  // Iniciar tutorial se necessario
  useEffect(() => {
    if (!loading && shouldShowTutorial('dashboard')) {
      const timer = setTimeout(() => startTutorial('dashboard'), 500)
      return () => clearTimeout(timer)
    }
  }, [loading, shouldShowTutorial, startTutorial])

  if (loading) {
    return <Loading fullScreen text="Carregando..." />
  }

  const saudacao = () => {
    const hora = new Date().getHours()
    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <PageContainer>
      {/* Saudacao */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {saudacao()}, {configuracoes.nomeEmpresa?.split(' ')[0] || 'Gestor'}!
        </h2>
        <p className="text-gray-500 capitalize">
          {formatDateLong(new Date())}
        </p>
      </div>

      {/* Card principal - Vendas do dia */}
      <div data-tutorial="vendas-hoje">
        <IndicadorMeta
          valor={resumo.faturamento}
          meta={resumo.metaDiaria}
          percentual={resumo.percentualMeta}
        />
      </div>

      {/* Cards de resumo */}
      <div className="mt-4" data-tutorial="cards-resumo">
        <ResumoCards
          totalVendas={resumo.totalVendas}
          ticketMedio={resumo.ticketMedio}
          vendasPorFormaPagamento={resumo.vendasPorFormaPagamento}
        />
      </div>

      {/* Grafico de vendas da semana */}
      <div className="mt-6" data-tutorial="grafico-vendas">
        <Card>
          <Card.Header>
            <Card.Title>Ultimos 7 dias</Card.Title>
          </Card.Header>
          <GraficoVendas dados={dadosGrafico} />
        </Card>
      </div>

      {/* Botao flutuante - Nova venda */}
      <div
        className="fixed bottom-24 right-4 z-30"
        data-tutorial="btn-nova-venda"
      >
        <Button
          onClick={() => navigate('/vendas', { state: { openModal: true } })}
          size="lg"
          className="rounded-full shadow-lg !px-6"
          icon={Plus}
        >
          Nova Venda
        </Button>
      </div>
    </PageContainer>
  )
}

export default Dashboard
