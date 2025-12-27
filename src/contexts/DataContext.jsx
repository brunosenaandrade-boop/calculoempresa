import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as db from '../services/supabase'
import { CONFIG_PADRAO } from '../utils/constants'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados dos dados
  const [configuracoes, setConfiguracoes] = useState(CONFIG_PADRAO)
  const [insumos, setInsumos] = useState([])
  const [pratos, setPratos] = useState([])
  const [vendas, setVendas] = useState([])
  const [custosFixos, setCustosFixos] = useState([])
  const [despesasNaoOperacionais, setDespesasNaoOperacionais] = useState([])

  // Carregar dados iniciais do Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Carregar todos os dados em paralelo
        const [
          configData,
          insumosData,
          pratosData,
          vendasData,
          custosData,
          despesasData
        ] = await Promise.all([
          db.getConfiguracoes(),
          db.getInsumos(),
          db.getPratos(),
          db.getVendas(),
          db.getCustosFixos(),
          db.getDespesasNaoOp()
        ])

        setConfiguracoes(configData || CONFIG_PADRAO)
        setInsumos(insumosData || [])
        setPratos(pratosData || [])
        setVendas(vendasData || [])
        setCustosFixos(custosData || [])
        setDespesasNaoOperacionais(despesasData || [])

        setError(null)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // ============ INSUMOS ============
  const addInsumo = useCallback(async (data) => {
    const newInsumo = await db.addInsumo(data)
    setInsumos((prev) => [...prev, newInsumo])
    return newInsumo
  }, [])

  const updateInsumo = useCallback(async (id, data) => {
    const updated = await db.updateInsumo(id, data)
    setInsumos((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }, [])

  const deleteInsumo = useCallback(async (id) => {
    await db.deleteInsumo(id)
    setInsumos((prev) => prev.filter((item) => item.id !== id))
    return true
  }, [])

  // ============ PRATOS ============
  const addPrato = useCallback(async (data) => {
    const newPrato = await db.addPrato(data)
    setPratos((prev) => [...prev, newPrato])
    return newPrato
  }, [])

  const updatePrato = useCallback(async (id, data) => {
    const updated = await db.updatePrato(id, data)
    setPratos((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }, [])

  const deletePrato = useCallback(async (id) => {
    await db.deletePrato(id)
    setPratos((prev) => prev.filter((item) => item.id !== id))
    return true
  }, [])

  // ============ VENDAS ============
  const addVenda = useCallback(async (data) => {
    const newVenda = await db.addVenda(data)
    setVendas((prev) => [newVenda, ...prev])
    return newVenda
  }, [])

  const updateVenda = useCallback(async (id, data) => {
    // Vendas geralmente nao sao editadas, mas mantemos por consistencia
    setVendas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    )
    return { id, ...data }
  }, [])

  const deleteVenda = useCallback(async (id) => {
    await db.deleteVenda(id)
    setVendas((prev) => prev.filter((item) => item.id !== id))
    return true
  }, [])

  // ============ CUSTOS FIXOS ============
  const addCustoFixo = useCallback(async (data) => {
    const newCusto = await db.addCustoFixo(data)
    setCustosFixos((prev) => [...prev, newCusto])
    return newCusto
  }, [])

  const updateCustoFixo = useCallback(async (id, data) => {
    const updated = await db.updateCustoFixo(id, data)
    setCustosFixos((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }, [])

  const deleteCustoFixo = useCallback(async (id) => {
    await db.deleteCustoFixo(id)
    setCustosFixos((prev) => prev.filter((item) => item.id !== id))
    return true
  }, [])

  // ============ DESPESAS NAO OPERACIONAIS ============
  const addDespesaNaoOp = useCallback(async (data) => {
    const newDespesa = await db.addDespesaNaoOp(data)
    setDespesasNaoOperacionais((prev) => [...prev, newDespesa])
    return newDespesa
  }, [])

  const deleteDespesaNaoOp = useCallback(async (id) => {
    await db.deleteDespesaNaoOp(id)
    setDespesasNaoOperacionais((prev) => prev.filter((item) => item.id !== id))
    return true
  }, [])

  // ============ CONFIGURACOES ============
  const updateConfiguracoes = useCallback(async (data) => {
    const updated = await db.upsertConfiguracoes({ ...configuracoes, ...data })
    setConfiguracoes(updated)
    return updated
  }, [configuracoes])

  // Filtrar vendas por data
  const getVendasByDate = useCallback((date) => {
    return vendas.filter((v) => v.data === date)
  }, [vendas])

  // Filtrar vendas por mes
  const getVendasByMonth = useCallback((year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    return vendas.filter((v) => v.data && v.data.startsWith(prefix))
  }, [vendas])

  return (
    <DataContext.Provider
      value={{
        loading,
        error,
        // Dados
        configuracoes,
        insumos,
        pratos,
        vendas,
        custosFixos,
        despesasNaoOperacionais,
        // Acoes Insumos
        addInsumo,
        updateInsumo,
        deleteInsumo,
        // Acoes Pratos
        addPrato,
        updatePrato,
        deletePrato,
        // Acoes Vendas
        addVenda,
        updateVenda,
        deleteVenda,
        getVendasByDate,
        getVendasByMonth,
        // Acoes Custos
        addCustoFixo,
        updateCustoFixo,
        deleteCustoFixo,
        // Acoes Despesas
        addDespesaNaoOp,
        deleteDespesaNaoOp,
        // Acoes Config
        updateConfiguracoes
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider')
  }
  return context
}
