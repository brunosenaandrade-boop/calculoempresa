import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  collections,
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  subscribeToCollection,
  where,
  orderBy
} from '../services/firebase'
import { CONFIG_PADRAO } from '../utils/constants'

const DataContext = createContext(null)

// Dados mockados para desenvolvimento (quando Firebase nao esta configurado)
const MOCK_MODE = true // Mude para false quando configurar o Firebase

const initialMockData = {
  configuracoes: CONFIG_PADRAO,
  insumos: [
    { id: '1', nome: 'Arroz', unidade: 'KG', precoUnitario: 3.30, ativo: true },
    { id: '2', nome: 'Feijao', unidade: 'KG', precoUnitario: 7.50, ativo: true },
    { id: '3', nome: 'File Mignon', unidade: 'KG', precoUnitario: 45.00, ativo: true },
    { id: '4', nome: 'Frango', unidade: 'KG', precoUnitario: 15.00, ativo: true },
    { id: '5', nome: 'Queijo Mussarela', unidade: 'KG', precoUnitario: 35.00, ativo: true },
    { id: '6', nome: 'Presunto', unidade: 'KG', precoUnitario: 25.00, ativo: true },
    { id: '7', nome: 'Oleo', unidade: 'L', precoUnitario: 8.00, ativo: true },
    { id: '8', nome: 'Refrigerante 2L', unidade: 'UN', precoUnitario: 7.00, ativo: true }
  ],
  pratos: [
    {
      id: '1',
      nome: 'Prato Executivo',
      categoria: 'Pratos Principais',
      ingredientes: [
        { insumoId: '1', insumoNome: 'Arroz', quantidade: 0.15, unidade: 'KG' },
        { insumoId: '2', insumoNome: 'Feijao', quantidade: 0.1, unidade: 'KG' },
        { insumoId: '4', insumoNome: 'Frango', quantidade: 0.2, unidade: 'KG' }
      ],
      custoTotal: 4.74,
      precoVendaSugerido: 10.53,
      precoVendaReal: 18.00,
      ativo: true
    },
    {
      id: '2',
      nome: 'File a Parmegiana',
      categoria: 'Pratos Principais',
      ingredientes: [
        { insumoId: '1', insumoNome: 'Arroz', quantidade: 0.15, unidade: 'KG' },
        { insumoId: '3', insumoNome: 'File Mignon', quantidade: 0.25, unidade: 'KG' },
        { insumoId: '5', insumoNome: 'Queijo Mussarela', quantidade: 0.1, unidade: 'KG' }
      ],
      custoTotal: 15.25,
      precoVendaSugerido: 33.89,
      precoVendaReal: 45.00,
      ativo: true
    },
    {
      id: '3',
      nome: 'Refrigerante',
      categoria: 'Bebidas',
      ingredientes: [
        { insumoId: '8', insumoNome: 'Refrigerante 2L', quantidade: 1, unidade: 'UN' }
      ],
      custoTotal: 7.00,
      precoVendaSugerido: 15.56,
      precoVendaReal: 8.00,
      ativo: true
    }
  ],
  vendas: [
    {
      id: '1',
      data: new Date().toISOString().split('T')[0],
      hora: '12:30',
      itens: [
        { pratoId: '1', pratoNome: 'Prato Executivo', quantidade: 2, precoUnitario: 18.00, subtotal: 36.00 },
        { pratoId: '3', pratoNome: 'Refrigerante', quantidade: 2, precoUnitario: 8.00, subtotal: 16.00 }
      ],
      formaPagamento: 'PIX',
      valorTotal: 52.00
    },
    {
      id: '2',
      data: new Date().toISOString().split('T')[0],
      hora: '13:15',
      itens: [
        { pratoId: '2', pratoNome: 'File a Parmegiana', quantidade: 1, precoUnitario: 45.00, subtotal: 45.00 }
      ],
      formaPagamento: 'CARTAO',
      valorTotal: 45.00
    }
  ],
  custosFixos: [
    { id: '1', nome: 'Aluguel', valor: 2500.00, categoria: 'Infraestrutura', ativo: true },
    { id: '2', nome: 'Energia', valor: 450.00, categoria: 'Infraestrutura', ativo: true },
    { id: '3', nome: 'Agua', valor: 120.00, categoria: 'Infraestrutura', ativo: true },
    { id: '4', nome: 'Internet', valor: 100.00, categoria: 'Servicos', ativo: true },
    { id: '5', nome: 'Funcionario', valor: 1800.00, categoria: 'Pessoal', ativo: true }
  ],
  despesasNaoOperacionais: []
}

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

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        if (MOCK_MODE) {
          // Usar dados mockados
          setConfiguracoes(initialMockData.configuracoes)
          setInsumos(initialMockData.insumos)
          setPratos(initialMockData.pratos)
          setVendas(initialMockData.vendas)
          setCustosFixos(initialMockData.custosFixos)
          setDespesasNaoOperacionais(initialMockData.despesasNaoOperacionais)
        } else {
          // Carregar do Firebase
          // TODO: Implementar carregamento real
        }

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
    if (MOCK_MODE) {
      const newInsumo = { id: Date.now().toString(), ...data, ativo: true }
      setInsumos((prev) => [...prev, newInsumo])
      return newInsumo
    }
    return await addDocument(collections.insumos, data)
  }, [])

  const updateInsumo = useCallback(async (id, data) => {
    if (MOCK_MODE) {
      setInsumos((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      )
      return { id, ...data }
    }
    return await updateDocument(collections.insumos, id, data)
  }, [])

  const deleteInsumo = useCallback(async (id) => {
    if (MOCK_MODE) {
      setInsumos((prev) => prev.filter((item) => item.id !== id))
      return true
    }
    return await deleteDocument(collections.insumos, id)
  }, [])

  // ============ PRATOS ============
  const addPrato = useCallback(async (data) => {
    if (MOCK_MODE) {
      const newPrato = { id: Date.now().toString(), ...data, ativo: true }
      setPratos((prev) => [...prev, newPrato])
      return newPrato
    }
    return await addDocument(collections.pratos, data)
  }, [])

  const updatePrato = useCallback(async (id, data) => {
    if (MOCK_MODE) {
      setPratos((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      )
      return { id, ...data }
    }
    return await updateDocument(collections.pratos, id, data)
  }, [])

  const deletePrato = useCallback(async (id) => {
    if (MOCK_MODE) {
      setPratos((prev) => prev.filter((item) => item.id !== id))
      return true
    }
    return await deleteDocument(collections.pratos, id)
  }, [])

  // ============ VENDAS ============
  const addVenda = useCallback(async (data) => {
    if (MOCK_MODE) {
      const newVenda = {
        id: Date.now().toString(),
        ...data,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
      setVendas((prev) => [...prev, newVenda])
      return newVenda
    }
    return await addDocument(collections.vendas, data)
  }, [])

  const updateVenda = useCallback(async (id, data) => {
    if (MOCK_MODE) {
      setVendas((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      )
      return { id, ...data }
    }
    return await updateDocument(collections.vendas, id, data)
  }, [])

  const deleteVenda = useCallback(async (id) => {
    if (MOCK_MODE) {
      setVendas((prev) => prev.filter((item) => item.id !== id))
      return true
    }
    return await deleteDocument(collections.vendas, id)
  }, [])

  // ============ CUSTOS FIXOS ============
  const addCustoFixo = useCallback(async (data) => {
    if (MOCK_MODE) {
      const newCusto = { id: Date.now().toString(), ...data, ativo: true }
      setCustosFixos((prev) => [...prev, newCusto])
      return newCusto
    }
    return await addDocument(collections.custosFixos, data)
  }, [])

  const updateCustoFixo = useCallback(async (id, data) => {
    if (MOCK_MODE) {
      setCustosFixos((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      )
      return { id, ...data }
    }
    return await updateDocument(collections.custosFixos, id, data)
  }, [])

  const deleteCustoFixo = useCallback(async (id) => {
    if (MOCK_MODE) {
      setCustosFixos((prev) => prev.filter((item) => item.id !== id))
      return true
    }
    return await deleteDocument(collections.custosFixos, id)
  }, [])

  // ============ DESPESAS NAO OPERACIONAIS ============
  const addDespesaNaoOp = useCallback(async (data) => {
    if (MOCK_MODE) {
      const newDespesa = { id: Date.now().toString(), ...data }
      setDespesasNaoOperacionais((prev) => [...prev, newDespesa])
      return newDespesa
    }
    return await addDocument(collections.despesasNaoOperacionais, data)
  }, [])

  const deleteDespesaNaoOp = useCallback(async (id) => {
    if (MOCK_MODE) {
      setDespesasNaoOperacionais((prev) => prev.filter((item) => item.id !== id))
      return true
    }
    return await deleteDocument(collections.despesasNaoOperacionais, id)
  }, [])

  // ============ CONFIGURACOES ============
  const updateConfiguracoes = useCallback(async (data) => {
    if (MOCK_MODE) {
      setConfiguracoes((prev) => ({ ...prev, ...data }))
      return data
    }
    return await updateDocument(collections.configuracoes, 'config', data)
  }, [])

  // Filtrar vendas por data
  const getVendasByDate = useCallback((date) => {
    return vendas.filter((v) => v.data === date)
  }, [vendas])

  // Filtrar vendas por mes
  const getVendasByMonth = useCallback((year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    return vendas.filter((v) => v.data.startsWith(prefix))
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
