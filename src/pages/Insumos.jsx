import { useState } from 'react'
import { Plus, Package, Edit2, Trash2 } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input, { CurrencyInput } from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import { formatCurrency } from '../utils/formatters'
import { UNIDADES } from '../utils/constants'

const Insumos = () => {
  const { insumos, addInsumo, updateInsumo, deleteInsumo } = useData()
  const { success, error } = useToast()

  const [modalAberto, setModalAberto] = useState(false)
  const [insumoEditando, setInsumoEditando] = useState(null)
  const [modalConfirmacao, setModalConfirmacao] = useState(null)

  // Form state
  const [nome, setNome] = useState('')
  const [unidade, setUnidade] = useState('')
  const [precoUnitario, setPrecoUnitario] = useState(0)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const insumosAtivos = insumos.filter((i) => i.ativo !== false)

  const resetForm = () => {
    setNome('')
    setUnidade('')
    setPrecoUnitario(0)
    setErrors({})
  }

  const abrirModal = (insumo = null) => {
    if (insumo) {
      setInsumoEditando(insumo)
      setNome(insumo.nome)
      setUnidade(insumo.unidade)
      setPrecoUnitario(insumo.precoUnitario)
    } else {
      setInsumoEditando(null)
      resetForm()
    }
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setInsumoEditando(null)
    resetForm()
  }

  const handleSalvar = async () => {
    const newErrors = {}
    if (!nome.trim()) newErrors.nome = 'Nome obrigatorio'
    if (!unidade) newErrors.unidade = 'Unidade obrigatoria'
    if (precoUnitario <= 0) newErrors.precoUnitario = 'Preco obrigatorio'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const data = { nome: nome.trim(), unidade, precoUnitario }

      if (insumoEditando) {
        await updateInsumo(insumoEditando.id, data)
        success('Insumo atualizado!')
      } else {
        await addInsumo(data)
        success('Insumo cadastrado!')
      }
      fecharModal()
    } catch (err) {
      error('Erro ao salvar insumo')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletar = async (id) => {
    try {
      await deleteInsumo(id)
      success('Insumo removido')
      setModalConfirmacao(null)
    } catch (err) {
      error('Erro ao remover insumo')
    }
  }

  const unidadesOptions = UNIDADES.map((u) => ({ value: u.value, label: u.label }))

  return (
    <PageContainer
      title="Insumos"
      subtitle="Ingredientes e materias-primas"
    >
      {insumosAtivos.length > 0 ? (
        <div className="space-y-3">
          {insumosAtivos.map((insumo) => (
            <Card key={insumo.id} className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Package size={20} className="text-amber-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{insumo.nome}</p>
                <p className="text-sm text-gray-500">{insumo.unidade}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {formatCurrency(insumo.precoUnitario)}
                </p>
                <p className="text-xs text-gray-500">/{insumo.unidade}</p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => abrirModal(insumo)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setModalConfirmacao(insumo)}
                  className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <PageContainer.Empty
          icon={Package}
          title="Nenhum insumo"
          description="Cadastre os ingredientes usados nos seus pratos"
          action={
            <Button onClick={() => abrirModal()} icon={Plus}>
              Novo Insumo
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
        title={insumoEditando ? 'Editar Insumo' : 'Novo Insumo'}
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={fecharModal} fullWidth disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} fullWidth loading={loading}>
              {insumoEditando ? 'Salvar' : 'Cadastrar'}
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
          placeholder="Ex: Arroz, File Mignon"
          error={errors.nome}
          required
        />

        <Select
          label="Unidade de Medida"
          options={unidadesOptions}
          value={unidade}
          onChange={(e) => {
            setUnidade(e.target.value)
            setErrors((prev) => ({ ...prev, unidade: null }))
          }}
          error={errors.unidade}
          required
        />

        <CurrencyInput
          label="Preco por Unidade"
          value={precoUnitario}
          onChange={(val) => {
            setPrecoUnitario(val)
            setErrors((prev) => ({ ...prev, precoUnitario: null }))
          }}
          error={errors.precoUnitario}
          required
        />
      </Modal>

      {/* Modal de confirmacao */}
      <Modal.Confirm
        isOpen={!!modalConfirmacao}
        onClose={() => setModalConfirmacao(null)}
        onConfirm={() => handleDeletar(modalConfirmacao?.id)}
        title="Excluir Insumo"
        message={`Deseja excluir "${modalConfirmacao?.nome}"?`}
      />
    </PageContainer>
  )
}

export default Insumos
