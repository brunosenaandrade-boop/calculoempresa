import { useState } from 'react'
import { Plus, Building2, Edit2, Trash2 } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input, { CurrencyInput } from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import { formatCurrency } from '../utils/formatters'
import { CATEGORIAS_CUSTOS } from '../utils/constants'

const CustosFixos = () => {
  const { custosFixos, addCustoFixo, updateCustoFixo, deleteCustoFixo } = useData()
  const { success, error } = useToast()

  const [modalAberto, setModalAberto] = useState(false)
  const [custoEditando, setCustoEditando] = useState(null)
  const [modalConfirmacao, setModalConfirmacao] = useState(null)

  // Form state
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0)
  const [categoria, setCategoria] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const custosAtivos = custosFixos.filter((c) => c.ativo !== false)
  const totalMensal = custosAtivos.reduce((sum, c) => sum + c.valor, 0)

  const resetForm = () => {
    setNome('')
    setValor(0)
    setCategoria('')
    setErrors({})
  }

  const abrirModal = (custo = null) => {
    if (custo) {
      setCustoEditando(custo)
      setNome(custo.nome)
      setValor(custo.valor)
      setCategoria(custo.categoria)
    } else {
      setCustoEditando(null)
      resetForm()
    }
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setCustoEditando(null)
    resetForm()
  }

  const handleSalvar = async () => {
    const newErrors = {}
    if (!nome.trim()) newErrors.nome = 'Nome obrigatorio'
    if (!categoria) newErrors.categoria = 'Categoria obrigatoria'
    if (valor <= 0) newErrors.valor = 'Valor obrigatorio'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const data = { nome: nome.trim(), valor, categoria }

      if (custoEditando) {
        await updateCustoFixo(custoEditando.id, data)
        success('Custo atualizado!')
      } else {
        await addCustoFixo(data)
        success('Custo cadastrado!')
      }
      fecharModal()
    } catch (err) {
      error('Erro ao salvar custo')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletar = async (id) => {
    try {
      await deleteCustoFixo(id)
      success('Custo removido')
      setModalConfirmacao(null)
    } catch (err) {
      error('Erro ao remover custo')
    }
  }

  const categoriasOptions = CATEGORIAS_CUSTOS.map((c) => ({ value: c, label: c }))

  // Agrupar por categoria
  const custosPorCategoria = CATEGORIAS_CUSTOS.reduce((acc, cat) => {
    const custosCat = custosAtivos.filter((c) => c.categoria === cat)
    if (custosCat.length > 0) {
      acc[cat] = custosCat
    }
    return acc
  }, {})

  return (
    <PageContainer
      title="Custos Fixos"
      subtitle={`Total mensal: ${formatCurrency(totalMensal)}`}
    >
      {custosAtivos.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(custosPorCategoria).map(([categoria, custosCat]) => (
            <PageContainer.Section key={categoria} title={categoria}>
              <div className="space-y-3">
                {custosCat.map((custo) => (
                  <Card key={custo.id} className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-xl">
                      <Building2 size={20} className="text-rose-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{custo.nome}</p>
                    </div>

                    <p className="font-bold text-gray-900">
                      {formatCurrency(custo.valor)}
                    </p>

                    <div className="flex gap-1">
                      <button
                        onClick={() => abrirModal(custo)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setModalConfirmacao(custo)}
                        className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </PageContainer.Section>
          ))}
        </div>
      ) : (
        <PageContainer.Empty
          icon={Building2}
          title="Nenhum custo fixo"
          description="Cadastre seus custos mensais fixos"
          action={
            <Button onClick={() => abrirModal()} icon={Plus}>
              Novo Custo
            </Button>
          }
        />
      )}

      {/* Botao flutuante */}
      <div className="fixed bottom-24 right-4 z-30">
        <Button
          onClick={() => abrirModal()}
          size="lg"
          className="rounded-full shadow-lg !p-4"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={custoEditando ? 'Editar Custo' : 'Novo Custo Fixo'}
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={fecharModal} fullWidth disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} fullWidth loading={loading}>
              {custoEditando ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        }
      >
        <Input
          label="Nome"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value)
            setErrors((prev) => ({ ...prev, nome: null }))
          }}
          placeholder="Ex: Aluguel, Energia, Funcionario"
          error={errors.nome}
          required
        />

        <Select
          label="Categoria"
          options={categoriasOptions}
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value)
            setErrors((prev) => ({ ...prev, categoria: null }))
          }}
          error={errors.categoria}
          required
        />

        <CurrencyInput
          label="Valor Mensal"
          value={valor}
          onChange={(val) => {
            setValor(val)
            setErrors((prev) => ({ ...prev, valor: null }))
          }}
          error={errors.valor}
          required
        />
      </Modal>

      {/* Modal de confirmacao */}
      <Modal.Confirm
        isOpen={!!modalConfirmacao}
        onClose={() => setModalConfirmacao(null)}
        onConfirm={() => handleDeletar(modalConfirmacao?.id)}
        title="Excluir Custo"
        message={`Deseja excluir "${modalConfirmacao?.nome}"?`}
      />
    </PageContainer>
  )
}

export default CustosFixos
