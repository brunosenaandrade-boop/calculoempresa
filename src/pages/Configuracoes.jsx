import { useState } from 'react'
import { Save, RotateCcw, HelpCircle, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { CurrencyInput, NumberInput } from '../components/ui/Input'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import { useTutorial } from '../contexts/TutorialContext'
import { formatCurrency } from '../utils/formatters'
import { SUPORTE } from '../utils/constants'

const Configuracoes = () => {
  const navigate = useNavigate()
  const { configuracoes, updateConfiguracoes } = useData()
  const { success, error } = useToast()
  const { resetAllTutorials } = useTutorial()

  const [nomeEmpresa, setNomeEmpresa] = useState(configuracoes.nomeEmpresa)
  const [taxaSimples, setTaxaSimples] = useState(configuracoes.taxaSimples)
  const [taxaCartao, setTaxaCartao] = useState(configuracoes.taxaCartao)
  const [custoFixoPercent, setCustoFixoPercent] = useState(configuracoes.custoFixoPercent)
  const [lucroDesejado, setLucroDesejado] = useState(configuracoes.lucroDesejado)
  const [metaDiaria, setMetaDiaria] = useState(configuracoes.metaDiaria)
  const [loading, setLoading] = useState(false)

  const handleSalvar = async () => {
    setLoading(true)
    try {
      await updateConfiguracoes({
        nomeEmpresa,
        taxaSimples,
        taxaCartao,
        custoFixoPercent,
        lucroDesejado,
        metaDiaria
      })
      success('Configuracoes salvas!')
    } catch (err) {
      error('Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const handleResetTutoriais = () => {
    resetAllTutorials()
    success('Tutoriais resetados! Serao exibidos novamente.')
  }

  return (
    <PageContainer title="Configuracoes">
      {/* Dados da empresa */}
      <PageContainer.Section title="Dados da Empresa">
        <Card>
          <Input
            label="Nome da Empresa"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
            placeholder="Nome do seu restaurante"
          />

          <CurrencyInput
            label="Meta Diaria de Vendas"
            value={metaDiaria}
            onChange={setMetaDiaria}
            helper="Valor que deseja vender por dia"
          />
        </Card>
      </PageContainer.Section>

      {/* Taxas e Impostos */}
      <PageContainer.Section title="Taxas e Impostos">
        <Card>
          <NumberInput
            label="Taxa Simples Nacional (%)"
            value={taxaSimples}
            onChange={setTaxaSimples}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
            helper="Aliquota do Simples sobre faturamento"
          />

          <NumberInput
            label="Taxa do Cartao (%)"
            value={taxaCartao}
            onChange={setTaxaCartao}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
            helper="Taxa cobrada nas vendas com cartao"
          />
        </Card>
      </PageContainer.Section>

      {/* Parametros de Precificacao */}
      <PageContainer.Section title="Precificacao">
        <Card>
          <NumberInput
            label="Custo Fixo Estimado (%)"
            value={custoFixoPercent}
            onChange={setCustoFixoPercent}
            min={0}
            max={100}
            step={1}
            suffix="%"
            helper="Percentual de custos fixos sobre vendas"
          />

          <NumberInput
            label="Lucro Desejado (%)"
            value={lucroDesejado}
            onChange={setLucroDesejado}
            min={0}
            max={100}
            step={1}
            suffix="%"
            helper="Margem de lucro desejada"
          />
        </Card>
      </PageContainer.Section>

      {/* Botao salvar */}
      <Button
        onClick={handleSalvar}
        fullWidth
        loading={loading}
        icon={Save}
        className="mb-6"
      >
        Salvar Configuracoes
      </Button>

      {/* Outras opcoes */}
      <PageContainer.Section title="Outras Opcoes">
        <div className="space-y-3">
          <Card
            hoverable
            onClick={() => navigate('/tutorial')}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-primary-100 rounded-xl">
              <HelpCircle size={20} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Ver Tutorial</p>
              <p className="text-sm text-gray-500">Aprenda a usar o sistema</p>
            </div>
          </Card>

          <Card
            hoverable
            onClick={handleResetTutoriais}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-amber-100 rounded-xl">
              <RotateCcw size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Resetar Tutoriais</p>
              <p className="text-sm text-gray-500">Ver novamente as dicas nas telas</p>
            </div>
          </Card>

          <Card
            hoverable
            onClick={() => navigate('/suporte')}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-success/20 rounded-xl">
              <Phone size={20} className="text-success" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Suporte</p>
              <p className="text-sm text-gray-500">{SUPORTE.telefone}</p>
            </div>
          </Card>
        </div>
      </PageContainer.Section>
    </PageContainer>
  )
}

export default Configuracoes
