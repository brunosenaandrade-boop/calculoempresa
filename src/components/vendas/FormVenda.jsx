import { useState, useMemo } from 'react'
import { Minus, Plus, Smartphone, CreditCard, Banknote } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatters'
import { FORMAS_PAGAMENTO } from '../../utils/constants'

const icones = {
  Smartphone,
  CreditCard,
  Banknote
}

const FormVenda = ({ pratos, onSubmit, onCancel }) => {
  const [itens, setItens] = useState({})
  const [formaPagamento, setFormaPagamento] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Calcular total
  const { itensVenda, valorTotal } = useMemo(() => {
    const itensArray = Object.entries(itens)
      .filter(([_, qtd]) => qtd > 0)
      .map(([pratoId, quantidade]) => {
        const prato = pratos.find((p) => p.id === pratoId)
        return {
          pratoId,
          pratoNome: prato?.nome || '',
          quantidade,
          precoUnitario: prato?.precoVendaReal || 0,
          subtotal: (prato?.precoVendaReal || 0) * quantidade
        }
      })

    const total = itensArray.reduce((sum, item) => sum + item.subtotal, 0)

    return { itensVenda: itensArray, valorTotal: total }
  }, [itens, pratos])

  const alterarQuantidade = (pratoId, delta) => {
    setItens((prev) => {
      const atual = prev[pratoId] || 0
      const novo = Math.max(0, atual + delta)
      if (novo === 0) {
        const { [pratoId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [pratoId]: novo }
    })
    setErrors((prev) => ({ ...prev, itens: null }))
  }

  const handleSubmit = async () => {
    // Validar
    const newErrors = {}

    if (itensVenda.length === 0) {
      newErrors.itens = 'Adicione pelo menos um item'
    }

    if (!formaPagamento) {
      newErrors.formaPagamento = 'Selecione a forma de pagamento'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        itens: itensVenda,
        formaPagamento,
        valorTotal
      })
    } finally {
      setLoading(false)
    }
  }

  // Agrupar pratos por categoria
  const pratosPorCategoria = useMemo(() => {
    return pratos.reduce((acc, prato) => {
      const cat = prato.categoria || 'Outros'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(prato)
      return acc
    }, {})
  }, [pratos])

  return (
    <div className="space-y-4">
      {/* Lista de pratos */}
      <div className="max-h-64 overflow-y-auto space-y-4">
        {Object.entries(pratosPorCategoria).map(([categoria, pratosCat]) => (
          <div key={categoria}>
            <h4 className="text-sm font-medium text-gray-500 mb-2">{categoria}</h4>
            <div className="space-y-2">
              {pratosCat.map((prato) => {
                const quantidade = itens[prato.id] || 0
                const subtotal = quantidade * prato.precoVendaReal

                return (
                  <Card
                    key={prato.id}
                    padding="sm"
                    className={`flex items-center justify-between ${
                      quantidade > 0 ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {prato.nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(prato.precoVendaReal)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {quantidade > 0 && (
                        <span className="text-sm font-medium text-primary-600 min-w-[60px] text-right">
                          {formatCurrency(subtotal)}
                        </span>
                      )}

                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(prato.id, -1)}
                          className="p-2 hover:bg-gray-200 rounded-l-lg disabled:opacity-50"
                          disabled={quantidade === 0}
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(prato.id, 1)}
                          className="p-2 hover:bg-gray-200 rounded-r-lg"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {errors.itens && (
        <p className="text-sm text-danger">{errors.itens}</p>
      )}

      {/* Forma de pagamento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Forma de Pagamento
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FORMAS_PAGAMENTO.map((forma) => {
            const Icon = icones[forma.icon]
            const isSelected = formaPagamento === forma.value

            return (
              <button
                key={forma.value}
                type="button"
                onClick={() => {
                  setFormaPagamento(forma.value)
                  setErrors((prev) => ({ ...prev, formaPagamento: null }))
                }}
                className={`
                  py-3 px-4 rounded-xl border-2 transition-all
                  flex flex-col items-center gap-1
                  ${isSelected
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                <Icon size={24} />
                <span className="text-sm font-medium">{forma.label}</span>
              </button>
            )
          })}
        </div>
        {errors.formaPagamento && (
          <p className="text-sm text-danger mt-1">{errors.formaPagamento}</p>
        )}
      </div>

      {/* Total e botoes */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-gray-700">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(valorTotal)}
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            fullWidth
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            fullWidth
            loading={loading}
            disabled={valorTotal === 0}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FormVenda
