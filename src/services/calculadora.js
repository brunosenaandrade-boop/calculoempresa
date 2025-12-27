/**
 * Calculadora de Precificacao e DRE
 * Logica financeira do sistema GestaoFacil
 */

import { CONFIG_PADRAO } from '../utils/constants'

/**
 * Calcula o custo total de um prato baseado nos ingredientes
 */
export const calcularCustoPrato = (ingredientes, insumos) => {
  if (!ingredientes || ingredientes.length === 0) return 0

  return ingredientes.reduce((total, ing) => {
    const insumo = insumos.find((i) => i.id === ing.insumoId)
    if (!insumo) return total

    const custoIngrediente = insumo.precoUnitario * ing.quantidade
    return total + custoIngrediente
  }, 0)
}

/**
 * Calcula o preco de venda sugerido usando markup
 */
export const calcularPrecoVendaSugerido = (custoTotal, config = CONFIG_PADRAO) => {
  if (custoTotal <= 0) return 0

  const { taxaSimples, taxaCartao, custoFixoPercent, lucroDesejado } = config

  // Markup = 100 / (100 - custos%)
  const totalPercentuais = taxaSimples + taxaCartao + custoFixoPercent + lucroDesejado
  const markup = 100 / (100 - totalPercentuais)

  return custoTotal * markup
}

/**
 * Calcula a margem real de um prato
 * Considera: Simples + Cartão + Custo Fixo (alocação)
 */
export const calcularMargemReal = (precoVenda, custoTotal, config = CONFIG_PADRAO) => {
  if (precoVenda <= 0) return 0

  const { taxaSimples, taxaCartao, custoFixoPercent } = config

  // Descontar impostos, taxas e alocação de custo fixo
  const deducoes = precoVenda * ((taxaSimples + taxaCartao + custoFixoPercent) / 100)
  const lucro = precoVenda - custoTotal - deducoes
  const margem = (lucro / precoVenda) * 100

  return margem
}

/**
 * Calcula o DRE mensal
 */
export const calcularDRE = (vendas, pratos, custosFixos, despesasNaoOp, config = CONFIG_PADRAO) => {
  // Faturamento Bruto
  const faturamentoBruto = vendas.reduce((total, venda) => total + venda.valorTotal, 0)

  // Custo da Mercadoria Vendida (CMV)
  const cmv = vendas.reduce((total, venda) => {
    const custoVenda = venda.itens.reduce((subtotal, item) => {
      const prato = pratos.find((p) => p.id === item.pratoId)
      const custoPrato = prato ? prato.custoTotal : 0
      return subtotal + (custoPrato * item.quantidade)
    }, 0)
    return total + custoVenda
  }, 0)

  // Vendas por forma de pagamento
  const vendasPorFormaPagamento = vendas.reduce((acc, venda) => {
    acc[venda.formaPagamento] = (acc[venda.formaPagamento] || 0) + venda.valorTotal
    return acc
  }, {})

  // Imposto Simples Nacional
  const impostoSimples = faturamentoBruto * (config.taxaSimples / 100)

  // Taxa de Cartao (apenas sobre vendas no cartao)
  const vendasCartao = vendasPorFormaPagamento.CARTAO || 0
  const taxaCartao = vendasCartao * (config.taxaCartao / 100)

  // Total Custos Variaveis
  const custosVariaveis = cmv + impostoSimples + taxaCartao

  // Margem de Contribuicao
  const margemContribuicao = faturamentoBruto - custosVariaveis
  const margemContribuicaoPercent = faturamentoBruto > 0
    ? (margemContribuicao / faturamentoBruto) * 100
    : 0

  // Total Custos Fixos
  const totalCustosFixos = custosFixos
    .filter((c) => c.ativo)
    .reduce((total, custo) => total + custo.valor, 0)

  // Lucro Operacional
  const lucroOperacional = margemContribuicao - totalCustosFixos
  const lucroOperacionalPercent = faturamentoBruto > 0
    ? (lucroOperacional / faturamentoBruto) * 100
    : 0

  // Total Despesas Nao Operacionais
  const totalDespesasNaoOp = despesasNaoOp.reduce((total, d) => total + d.valorParcela, 0)

  // Resultado Liquido
  const resultadoLiquido = lucroOperacional - totalDespesasNaoOp
  const resultadoLiquidoPercent = faturamentoBruto > 0
    ? (resultadoLiquido / faturamentoBruto) * 100
    : 0

  // Ponto de Equilibrio
  const pontoEquilibrio = margemContribuicaoPercent > 0
    ? totalCustosFixos / (margemContribuicaoPercent / 100)
    : 0

  // Ponto de Equilibrio com Lucro Desejado
  const lucroDesejadoValor = faturamentoBruto * (config.lucroDesejado / 100)
  const pontoEquilibrioComLucro = margemContribuicaoPercent > 0
    ? (totalCustosFixos + lucroDesejadoValor) / (margemContribuicaoPercent / 100)
    : 0

  return {
    // Receitas
    faturamentoBruto,
    vendasPorFormaPagamento,

    // Custos Variaveis
    cmv,
    cmvPercent: faturamentoBruto > 0 ? (cmv / faturamentoBruto) * 100 : 0,
    impostoSimples,
    impostoSimplesPercent: config.taxaSimples,
    taxaCartao,
    taxaCartaoPercent: faturamentoBruto > 0 ? (taxaCartao / faturamentoBruto) * 100 : 0,
    custosVariaveis,
    custosVariaveisPercent: faturamentoBruto > 0 ? (custosVariaveis / faturamentoBruto) * 100 : 0,

    // Margem de Contribuicao
    margemContribuicao,
    margemContribuicaoPercent,

    // Custos Fixos
    totalCustosFixos,
    totalCustosFixosPercent: faturamentoBruto > 0 ? (totalCustosFixos / faturamentoBruto) * 100 : 0,

    // Resultados
    lucroOperacional,
    lucroOperacionalPercent,
    totalDespesasNaoOp,
    resultadoLiquido,
    resultadoLiquidoPercent,

    // Indicadores
    pontoEquilibrio,
    pontoEquilibrioComLucro,

    // Totais
    totalVendas: vendas.length,
    ticketMedio: vendas.length > 0 ? faturamentoBruto / vendas.length : 0
  }
}

/**
 * Calcula resumo do dia
 */
export const calcularResumoDia = (vendas, metaDiaria = CONFIG_PADRAO.metaDiaria) => {
  const totalVendas = vendas.length
  const faturamento = vendas.reduce((total, v) => total + v.valorTotal, 0)
  const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0
  const percentualMeta = metaDiaria > 0 ? (faturamento / metaDiaria) * 100 : 0

  const vendasPorFormaPagamento = vendas.reduce((acc, v) => {
    acc[v.formaPagamento] = (acc[v.formaPagamento] || 0) + v.valorTotal
    return acc
  }, {})

  return {
    totalVendas,
    faturamento,
    ticketMedio,
    metaDiaria,
    percentualMeta,
    atingiuMeta: faturamento >= metaDiaria,
    vendasPorFormaPagamento
  }
}

/**
 * Calcula vendas por periodo (ultimos X dias)
 */
export const calcularVendasPorPeriodo = (vendas, dias = 7) => {
  const hoje = new Date()
  const resultado = []

  for (let i = dias - 1; i >= 0; i--) {
    const data = new Date(hoje)
    data.setDate(data.getDate() - i)
    const dataStr = data.toISOString().split('T')[0]

    const vendasDia = vendas.filter((v) => v.data === dataStr)
    const total = vendasDia.reduce((sum, v) => sum + v.valorTotal, 0)

    resultado.push({
      data: dataStr,
      diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'short' }),
      total,
      quantidade: vendasDia.length
    })
  }

  return resultado
}
