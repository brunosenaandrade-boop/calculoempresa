import { Smartphone, CreditCard, Banknote, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatters'

const icones = {
  PIX: Smartphone,
  CARTAO: CreditCard,
  DINHEIRO: Banknote
}

const ListaVendas = ({ vendas, onDelete }) => {
  return (
    <div className="space-y-3">
      {vendas.map((venda) => {
        const Icon = icones[venda.formaPagamento] || Banknote

        return (
          <Card key={venda.id} className="flex items-start gap-3">
            {/* Icone forma de pagamento */}
            <div className="p-2 bg-primary-100 rounded-xl">
              <Icon size={20} className="text-primary-600" />
            </div>

            {/* Detalhes */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(venda.valorTotal)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {venda.hora} - {venda.formaPagamento}
                  </p>
                </div>

                <button
                  onClick={() => onDelete(venda)}
                  className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Itens */}
              <div className="mt-2 text-sm text-gray-600">
                {venda.itens.map((item, idx) => (
                  <span key={idx}>
                    {item.quantidade}x {item.pratoNome}
                    {idx < venda.itens.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default ListaVendas
