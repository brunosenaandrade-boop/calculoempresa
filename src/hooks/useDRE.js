import { useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { calcularDRE, calcularResumoDia, calcularVendasPorPeriodo } from '../services/calculadora'

/**
 * Hook para calculos do DRE e indicadores financeiros
 */
export const useDRE = (ano, mes) => {
  const {
    vendas,
    pratos,
    custosFixos,
    despesasNaoOperacionais,
    configuracoes,
    getVendasByMonth
  } = useData()

  // Vendas do mes selecionado
  const vendasMes = useMemo(() => {
    return getVendasByMonth(ano, mes)
  }, [getVendasByMonth, ano, mes])

  // Despesas do mes
  const despesasMes = useMemo(() => {
    const mesKey = `${ano}-${String(mes).padStart(2, '0')}`
    return despesasNaoOperacionais.filter((d) => d.mesAno === mesKey)
  }, [despesasNaoOperacionais, ano, mes])

  // Calculo do DRE
  const dre = useMemo(() => {
    return calcularDRE(vendasMes, pratos, custosFixos, despesasMes, configuracoes)
  }, [vendasMes, pratos, custosFixos, despesasMes, configuracoes])

  return {
    dre,
    vendasMes,
    despesasMes
  }
}

/**
 * Hook para resumo do dia atual
 */
export const useResumoDia = (data) => {
  const { vendas, configuracoes, getVendasByDate } = useData()

  const vendasDia = useMemo(() => {
    return getVendasByDate(data)
  }, [getVendasByDate, data])

  const resumo = useMemo(() => {
    return calcularResumoDia(vendasDia, configuracoes.metaDiaria)
  }, [vendasDia, configuracoes.metaDiaria])

  return {
    resumo,
    vendasDia
  }
}

/**
 * Hook para grafico de vendas dos ultimos dias
 */
export const useVendasPeriodo = (dias = 7) => {
  const { vendas } = useData()

  const dadosGrafico = useMemo(() => {
    return calcularVendasPorPeriodo(vendas, dias)
  }, [vendas, dias])

  const totalPeriodo = useMemo(() => {
    return dadosGrafico.reduce((sum, d) => sum + d.total, 0)
  }, [dadosGrafico])

  const mediaDiaria = useMemo(() => {
    return totalPeriodo / dias
  }, [totalPeriodo, dias])

  return {
    dadosGrafico,
    totalPeriodo,
    mediaDiaria
  }
}

export default useDRE
