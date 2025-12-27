import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home,
  ShoppingCart,
  UtensilsCrossed,
  BarChart3,
  Package,
  Building2,
  CheckCircle,
  ChevronRight
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useTutorial } from '../contexts/TutorialContext'

const tutoriais = [
  {
    id: 'dashboard',
    titulo: 'Dashboard',
    descricao: 'Veja o resumo do dia e acompanhe suas vendas',
    icon: Home,
    rota: '/',
    passos: [
      'Visualize as vendas do dia',
      'Acompanhe a meta diaria',
      'Veja o grafico da semana',
      'Registre vendas rapidamente'
    ]
  },
  {
    id: 'vendas',
    titulo: 'Vendas',
    descricao: 'Registre e acompanhe suas vendas diarias',
    icon: ShoppingCart,
    rota: '/vendas',
    passos: [
      'Selecione os pratos vendidos',
      'Escolha a forma de pagamento',
      'Confirme a venda em 1 toque',
      'Veja o historico por dia'
    ]
  },
  {
    id: 'pratos',
    titulo: 'Pratos',
    descricao: 'Cadastre pratos e calcule precos automaticamente',
    icon: UtensilsCrossed,
    rota: '/pratos',
    passos: [
      'Cadastre os pratos do cardapio',
      'Adicione os ingredientes',
      'O sistema calcula o custo',
      'Defina o preco e veja a margem'
    ]
  },
  {
    id: 'dre',
    titulo: 'DRE',
    descricao: 'Demonstrativo de Resultado mensal automatico',
    icon: BarChart3,
    rota: '/dre',
    passos: [
      'Veja receitas e despesas',
      'Acompanhe a margem de lucro',
      'Identifique o ponto de equilibrio',
      'Tome decisoes baseadas em dados'
    ]
  },
  {
    id: 'insumos',
    titulo: 'Insumos',
    descricao: 'Cadastre ingredientes e materias-primas',
    icon: Package,
    rota: '/insumos',
    passos: [
      'Cadastre os ingredientes',
      'Informe precos por unidade',
      'Atualize quando o preco mudar'
    ]
  },
  {
    id: 'custos',
    titulo: 'Custos Fixos',
    descricao: 'Controle despesas mensais fixas',
    icon: Building2,
    rota: '/custos',
    passos: [
      'Cadastre aluguel, luz, agua...',
      'Organize por categoria',
      'Esses valores entram no DRE'
    ]
  }
]

const Tutorial = () => {
  const navigate = useNavigate()
  const { completedTutorials, startTutorial } = useTutorial()
  const [tutorialExpandido, setTutorialExpandido] = useState(null)

  const handleIniciarTutorial = (tutorial) => {
    navigate(tutorial.rota)
    startTutorial(tutorial.id)
  }

  return (
    <PageContainer
      title="Tutorial"
      subtitle="Aprenda a usar o GestaoFacil"
    >
      <div className="space-y-4">
        {tutoriais.map((tutorial) => {
          const Icon = tutorial.icon
          const concluido = completedTutorials[tutorial.id]
          const expandido = tutorialExpandido === tutorial.id

          return (
            <Card
              key={tutorial.id}
              onClick={() =>
                setTutorialExpandido(expandido ? null : tutorial.id)
              }
              hoverable
              className={concluido ? 'border-l-4 border-success' : ''}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${
                  concluido ? 'bg-success/20' : 'bg-primary-100'
                }`}>
                  {concluido ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <Icon size={20} className="text-primary-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">
                      {tutorial.titulo}
                    </p>
                    <ChevronRight
                      size={20}
                      className={`text-gray-400 transition-transform ${
                        expandido ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {tutorial.descricao}
                  </p>

                  {/* Passos expandidos */}
                  {expandido && (
                    <div className="mt-4 space-y-2">
                      {tutorial.passos.map((passo, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                            {idx + 1}
                          </div>
                          {passo}
                        </div>
                      ))}

                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleIniciarTutorial(tutorial)
                        }}
                        size="sm"
                        fullWidth
                        className="mt-4"
                      >
                        {concluido ? 'Ver Novamente' : 'Iniciar Tutorial'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Dica */}
      <Card className="mt-6 bg-primary-50 border border-primary-200">
        <p className="text-sm text-primary-800">
          <strong>Dica:</strong> Os tutoriais aparecem automaticamente na primeira vez que voce acessa cada tela. Voce pode reinicia-los nas Configuracoes.
        </p>
      </Card>
    </PageContainer>
  )
}

export default Tutorial
