import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Calendar, ShoppingCart } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import FormVenda from '../components/vendas/FormVenda'
import ListaVendas from '../components/vendas/ListaVendas'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import { formatDate, formatCurrency } from '../utils/formatters'

const Vendas = () => {
  const location = useLocation()
  const { vendas, pratos, addVenda, deleteVenda, getVendasByDate } = useData()
  const { success, error } = useToast()

  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [modalAberto, setModalAberto] = useState(false)
  const [modalConfirmacao, setModalConfirmacao] = useState(null)

  // Abrir modal se veio do dashboard
  useEffect(() => {
    if (location.state?.openModal) {
      setModalAberto(true)
      // Limpar o state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const vendasDoDia = getVendasByDate(dataSelecionada)
  const totalDoDia = vendasDoDia.reduce((sum, v) => sum + v.valorTotal, 0)

  const handleSalvarVenda = async (data) => {
    try {
      await addVenda({
        ...data,
        data: dataSelecionada
      })
      success('Venda registrada com sucesso!')
      setModalAberto(false)
    } catch (err) {
      error('Erro ao registrar venda')
    }
  }

  const handleDeletarVenda = async (id) => {
    try {
      await deleteVenda(id)
      success('Venda removida')
      setModalConfirmacao(null)
    } catch (err) {
      error('Erro ao remover venda')
    }
  }

  const handleMudarData = (dias) => {
    const novaData = new Date(dataSelecionada)
    novaData.setDate(novaData.getDate() + dias)
    setDataSelecionada(novaData.toISOString().split('T')[0])
  }

  const isHoje = dataSelecionada === new Date().toISOString().split('T')[0]

  return (
    <PageContainer>
      {/* Seletor de data */}
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleMudarData(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <span className="text-xl">&lt;</span>
          </button>

          <div className="text-center">
            <p className="font-semibold text-gray-900">
              {isHoje ? 'Hoje' : formatDate(dataSelecionada)}
            </p>
            <p className="text-sm text-gray-500">
              {vendasDoDia.length} vendas - {formatCurrency(totalDoDia)}
            </p>
          </div>

          <button
            onClick={() => handleMudarData(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={isHoje}
          >
            <span className={`text-xl ${isHoje ? 'text-gray-300' : ''}`}>&gt;</span>
          </button>
        </div>
      </Card>

      {/* Lista de vendas */}
      <div data-tutorial="lista-vendas">
        {vendasDoDia.length > 0 ? (
          <ListaVendas
            vendas={vendasDoDia}
            onDelete={(venda) => setModalConfirmacao(venda)}
          />
        ) : (
          <PageContainer.Empty
            icon={ShoppingCart}
            title="Nenhuma venda"
            description={`Nenhuma venda registrada ${isHoje ? 'hoje' : 'neste dia'}`}
            action={
              <Button onClick={() => setModalAberto(true)} icon={Plus}>
                Registrar Venda
              </Button>
            }
          />
        )}
      </div>

      {/* Botao flutuante */}
      <div
        className="fixed bottom-24 right-4 z-30"
        data-tutorial="btn-nova-venda"
      >
        <Button
          onClick={() => setModalAberto(true)}
          size="lg"
          className="rounded-full shadow-lg !p-4"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Modal de nova venda */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Nova Venda"
        size="lg"
      >
        <FormVenda
          pratos={pratos.filter((p) => p.ativo)}
          onSubmit={handleSalvarVenda}
          onCancel={() => setModalAberto(false)}
        />
      </Modal>

      {/* Modal de confirmacao de exclusao */}
      <Modal.Confirm
        isOpen={!!modalConfirmacao}
        onClose={() => setModalConfirmacao(null)}
        onConfirm={() => handleDeletarVenda(modalConfirmacao?.id)}
        title="Excluir Venda"
        message={`Deseja excluir esta venda de ${formatCurrency(modalConfirmacao?.valorTotal)}?`}
      />
    </PageContainer>
  )
}

export default Vendas
