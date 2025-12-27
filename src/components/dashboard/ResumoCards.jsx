import { ShoppingCart, Receipt, Smartphone, CreditCard, Banknote } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatters'

const ResumoCards = ({ totalVendas, ticketMedio, vendasPorFormaPagamento }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total de Vendas */}
      <Card className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-xl">
          <ShoppingCart size={20} className="text-primary-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Vendas</p>
          <p className="text-xl font-bold text-gray-900">{totalVendas}</p>
        </div>
      </Card>

      {/* Ticket Medio */}
      <Card className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-xl">
          <Receipt size={20} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Ticket Medio</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(ticketMedio)}
          </p>
        </div>
      </Card>

      {/* Vendas por forma de pagamento */}
      <Card className="col-span-2">
        <p className="text-xs text-gray-500 mb-3">Por forma de pagamento</p>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-gray-400" />
            <span className="text-sm font-medium">
              {formatCurrency(vendasPorFormaPagamento?.PIX || 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-gray-400" />
            <span className="text-sm font-medium">
              {formatCurrency(vendasPorFormaPagamento?.CARTAO || 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote size={16} className="text-gray-400" />
            <span className="text-sm font-medium">
              {formatCurrency(vendasPorFormaPagamento?.DINHEIRO || 0)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ResumoCards
