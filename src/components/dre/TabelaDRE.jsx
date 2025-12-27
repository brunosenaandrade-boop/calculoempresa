import { formatCurrency, formatPercent } from '../../utils/formatters'

const TabelaDRE = ({ dre }) => {
  const LinhaItem = ({ label, valor, percent, indent = false, bold = false, color }) => (
    <div className={`flex items-center justify-between py-2 ${indent ? 'pl-4' : ''}`}>
      <span className={`${bold ? 'font-semibold' : ''} ${color || 'text-gray-700'}`}>
        {indent && <span className="text-gray-300 mr-2">|</span>}
        {label}
      </span>
      <div className="flex items-center gap-4">
        <span className={`${bold ? 'font-semibold' : ''} ${color || 'text-gray-900'}`}>
          {formatCurrency(valor)}
        </span>
        {percent !== undefined && (
          <span className="text-sm text-gray-500 w-16 text-right">
            {formatPercent(percent)}
          </span>
        )}
      </div>
    </div>
  )

  const Divisor = () => <div className="border-t border-gray-200 my-2" />

  const LinhaTotalizador = ({ label, valor, percent, color }) => (
    <div className={`flex items-center justify-between py-3 px-3 rounded-lg ${
      color === 'success' ? 'bg-success/10' :
      color === 'danger' ? 'bg-danger/10' :
      color === 'warning' ? 'bg-warning/10' :
      'bg-gray-100'
    }`}>
      <span className={`font-semibold ${
        color === 'success' ? 'text-success' :
        color === 'danger' ? 'text-danger' :
        color === 'warning' ? 'text-warning' :
        'text-gray-900'
      }`}>
        {label}
      </span>
      <div className="flex items-center gap-4">
        <span className={`font-bold text-lg ${
          color === 'success' ? 'text-success' :
          color === 'danger' ? 'text-danger' :
          color === 'warning' ? 'text-warning' :
          'text-gray-900'
        }`}>
          {formatCurrency(valor)}
        </span>
        {percent !== undefined && (
          <span className={`text-sm w-16 text-right ${
            color === 'success' ? 'text-success' :
            color === 'danger' ? 'text-danger' :
            color === 'warning' ? 'text-warning' :
            'text-gray-500'
          }`}>
            {formatPercent(percent)}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="text-sm">
      {/* RECEITAS */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Receitas</p>
        <LinhaItem
          label="Faturamento Bruto"
          valor={dre.faturamentoBruto}
          percent={100}
          bold
        />
      </div>

      <Divisor />

      {/* CUSTOS VARIAVEIS */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Custos Variaveis</p>
        <LinhaItem
          label="CMV (Custo Mercadoria)"
          valor={dre.cmv}
          percent={dre.cmvPercent}
          indent
        />
        <LinhaItem
          label="Simples Nacional"
          valor={dre.impostoSimples}
          percent={dre.impostoSimplesPercent}
          indent
        />
        <LinhaItem
          label="Taxa Cartao"
          valor={dre.taxaCartao}
          percent={dre.taxaCartaoPercent}
          indent
        />
        <LinhaItem
          label="Total Custos Variaveis"
          valor={dre.custosVariaveis}
          percent={dre.custosVariaveisPercent}
          bold
          color="text-danger"
        />
      </div>

      <Divisor />

      {/* MARGEM DE CONTRIBUICAO */}
      <LinhaTotalizador
        label="Margem de Contribuicao"
        valor={dre.margemContribuicao}
        percent={dre.margemContribuicaoPercent}
        color={dre.margemContribuicaoPercent >= 50 ? 'success' : 'warning'}
      />

      <Divisor />

      {/* CUSTOS FIXOS */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Custos Fixos</p>
        <LinhaItem
          label="Total Custos Fixos"
          valor={dre.totalCustosFixos}
          percent={dre.totalCustosFixosPercent}
          bold
          color="text-danger"
        />
      </div>

      <Divisor />

      {/* LUCRO OPERACIONAL */}
      <LinhaTotalizador
        label="Lucro Operacional"
        valor={dre.lucroOperacional}
        percent={dre.lucroOperacionalPercent}
        color={dre.lucroOperacional >= 0 ? 'success' : 'danger'}
      />

      {/* DESPESAS NAO OPERACIONAIS */}
      {dre.totalDespesasNaoOp > 0 && (
        <>
          <Divisor />
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Despesas Nao Operacionais</p>
            <LinhaItem
              label="Emprestimos/Parcelamentos"
              valor={dre.totalDespesasNaoOp}
              indent
            />
          </div>

          <Divisor />

          <LinhaTotalizador
            label="Resultado Liquido"
            valor={dre.resultadoLiquido}
            percent={dre.resultadoLiquidoPercent}
            color={dre.resultadoLiquido >= 0 ? 'success' : 'danger'}
          />
        </>
      )}
    </div>
  )
}

export default TabelaDRE
