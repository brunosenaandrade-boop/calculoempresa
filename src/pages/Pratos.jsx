import { useState } from 'react'
import { Plus, UtensilsCrossed, Edit2, Trash2 } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import FormPrato from '../components/pratos/FormPrato'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { CATEGORIAS_PRATOS } from '../utils/constants'

const Pratos = () => {
  const { pratos, insumos, addPrato, updatePrato, deletePrato } = useData()
  const { success, error } = useToast()

  const [modalAberto, setModalAberto] = useState(false)
  const [pratoEditando, setPratoEditando] = useState(null)
  const [modalConfirmacao, setModalConfirmacao] = useState(null)

  const pratosAtivos = pratos.filter((p) => p.ativo)

  const handleSalvar = async (data) => {
    try {
      if (pratoEditando) {
        await updatePrato(pratoEditando.id, data)
        success('Prato atualizado!')
      } else {
        await addPrato(data)
        success('Prato cadastrado!')
      }
      fecharModal()
    } catch (err) {
      error('Erro ao salvar prato')
    }
  }

  const handleDeletar = async (id) => {
    try {
      await deletePrato(id)
      success('Prato removido')
      setModalConfirmacao(null)
    } catch (err) {
      error('Erro ao remover prato')
    }
  }

  const fecharModal = () => {
    setModalAberto(false)
    setPratoEditando(null)
  }

  const abrirEdicao = (prato) => {
    setPratoEditando(prato)
    setModalAberto(true)
  }

  // Agrupar por categoria
  const pratosPorCategoria = CATEGORIAS_PRATOS.reduce((acc, cat) => {
    const pratosCat = pratosAtivos.filter((p) => p.categoria === cat)
    if (pratosCat.length > 0) {
      acc[cat] = pratosCat
    }
    return acc
  }, {})

  return (
    <PageContainer>
      {pratosAtivos.length > 0 ? (
        <div data-tutorial="lista-pratos" className="space-y-6">
          {Object.entries(pratosPorCategoria).map(([categoria, pratosCat]) => (
            <PageContainer.Section key={categoria} title={categoria}>
              <div className="space-y-3">
                {pratosCat.map((prato) => {
                  const margemColor =
                    prato.margemReal >= 30
                      ? 'text-success'
                      : prato.margemReal >= 15
                      ? 'text-warning'
                      : 'text-danger'

                  return (
                    <Card key={prato.id} className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-xl">
                        <UtensilsCrossed size={20} className="text-primary-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {prato.nome}
                            </p>
                            <p className="text-sm text-gray-500">
                              Custo: {formatCurrency(prato.custoTotal)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              {formatCurrency(prato.precoVendaReal)}
                            </p>
                            <p className={`text-sm font-medium ${margemColor}`}>
                              Margem: {formatPercent(prato.margemReal)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => abrirEdicao(prato)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setModalConfirmacao(prato)}
                            className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </PageContainer.Section>
          ))}
        </div>
      ) : (
        <PageContainer.Empty
          icon={UtensilsCrossed}
          title="Nenhum prato"
          description="Cadastre os pratos do seu cardapio"
          action={
            <Button onClick={() => setModalAberto(true)} icon={Plus}>
              Novo Prato
            </Button>
          }
        />
      )}

      {/* Botao flutuante */}
      <div
        className="fixed bottom-24 right-4 z-30"
        data-tutorial="btn-novo-prato"
      >
        <Button
          onClick={() => setModalAberto(true)}
          size="lg"
          className="rounded-full shadow-lg !p-4"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Modal de cadastro/edicao */}
      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title={pratoEditando ? 'Editar Prato' : 'Novo Prato'}
        size="lg"
      >
        <FormPrato
          prato={pratoEditando}
          insumos={insumos.filter((i) => i.ativo)}
          onSubmit={handleSalvar}
          onCancel={fecharModal}
        />
      </Modal>

      {/* Modal de confirmacao */}
      <Modal.Confirm
        isOpen={!!modalConfirmacao}
        onClose={() => setModalConfirmacao(null)}
        onConfirm={() => handleDeletar(modalConfirmacao?.id)}
        title="Excluir Prato"
        message={`Deseja excluir "${modalConfirmacao?.nome}"?`}
      />
    </PageContainer>
  )
}

export default Pratos
