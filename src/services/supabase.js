import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://izroixvjygnkhkvshlks.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cm9peHZqeWdua2hrdnNobGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDUxMzQsImV4cCI6MjA4MjQyMTEzNH0.ctdksEAjv5bCJ6q_TwH32W1YmAOlmcau2aLXUQJ9D_c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============ HELPERS DE MAPEAMENTO ============
// Converte snake_case do banco para camelCase do JS

const mapConfigFromDB = (data) => {
  if (!data) return null
  return {
    id: data.id,
    nomeEmpresa: data.nome_empresa,
    taxaSimples: data.taxa_simples,
    taxaCartao: data.taxa_cartao,
    custoFixoPercent: data.custo_fixo_percent,
    lucroDesejado: data.lucro_desejado,
    metaDiaria: data.meta_diaria,
    suporteTelefone: data.suporte_telefone,
    tutorialConcluido: data.tutorial_concluido
  }
}

const mapConfigToDB = (data) => ({
  nome_empresa: data.nomeEmpresa,
  taxa_simples: data.taxaSimples,
  taxa_cartao: data.taxaCartao,
  custo_fixo_percent: data.custoFixoPercent,
  lucro_desejado: data.lucroDesejado,
  meta_diaria: data.metaDiaria,
  suporte_telefone: data.suporteTelefone,
  tutorial_concluido: data.tutorialConcluido
})

const mapInsumoFromDB = (data) => ({
  id: data.id,
  nome: data.nome,
  unidade: data.unidade,
  precoUnitario: data.preco_unitario,
  fornecedor: data.fornecedor,
  ativo: data.ativo
})

const mapInsumoToDB = (data) => ({
  nome: data.nome,
  unidade: data.unidade,
  preco_unitario: data.precoUnitario,
  fornecedor: data.fornecedor,
  ativo: data.ativo
})

const mapPratoFromDB = (data) => ({
  id: data.id,
  nome: data.nome,
  categoria: data.categoria,
  descricao: data.descricao,
  ingredientes: data.ingredientes || [],
  custoTotal: data.custo_total,
  precoVendaSugerido: data.preco_venda_sugerido,
  precoVendaReal: data.preco_venda_real,
  margemReal: data.margem_real,
  ativo: data.ativo
})

const mapPratoToDB = (data) => ({
  nome: data.nome,
  categoria: data.categoria,
  descricao: data.descricao,
  ingredientes: data.ingredientes,
  custo_total: data.custoTotal,
  preco_venda_sugerido: data.precoVendaSugerido,
  preco_venda_real: data.precoVendaReal,
  margem_real: data.margemReal,
  ativo: data.ativo
})

const mapVendaFromDB = (data) => ({
  id: data.id,
  data: data.data,
  hora: data.hora,
  itens: data.itens || [],
  formaPagamento: data.forma_pagamento,
  valorTotal: data.valor_total,
  desconto: data.desconto,
  observacao: data.observacao
})

const mapVendaToDB = (data) => ({
  data: data.data,
  hora: data.hora,
  itens: data.itens,
  forma_pagamento: data.formaPagamento,
  valor_total: data.valorTotal,
  desconto: data.desconto,
  observacao: data.observacao
})

const mapCustoFromDB = (data) => ({
  id: data.id,
  nome: data.nome,
  valor: data.valor,
  categoria: data.categoria,
  diaVencimento: data.dia_vencimento,
  recorrente: data.recorrente,
  ativo: data.ativo
})

const mapCustoToDB = (data) => ({
  nome: data.nome,
  valor: data.valor,
  categoria: data.categoria,
  dia_vencimento: data.diaVencimento,
  recorrente: data.recorrente,
  ativo: data.ativo
})

const mapDespesaFromDB = (data) => ({
  id: data.id,
  nome: data.nome,
  tipo: data.tipo,
  valorParcela: data.valor_parcela,
  parcelaAtual: data.parcela_atual,
  totalParcelas: data.total_parcelas,
  mesAno: data.mes_ano,
  observacao: data.observacao
})

const mapDespesaToDB = (data) => ({
  nome: data.nome,
  tipo: data.tipo,
  valor_parcela: data.valorParcela,
  parcela_atual: data.parcelaAtual,
  total_parcelas: data.totalParcelas,
  mes_ano: data.mesAno,
  observacao: data.observacao
})

// ============ CONFIGURACOES ============
export const getConfiguracoes = async () => {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return mapConfigFromDB(data)
}

export const upsertConfiguracoes = async (config) => {
  const { data, error } = await supabase
    .from('configuracoes')
    .upsert({ id: 1, ...mapConfigToDB(config), updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return mapConfigFromDB(data)
}

// ============ INSUMOS ============
export const getInsumos = async () => {
  const { data, error } = await supabase
    .from('insumos')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  if (error) throw error
  return (data || []).map(mapInsumoFromDB)
}

export const addInsumo = async (insumo) => {
  const { data, error } = await supabase
    .from('insumos')
    .insert({ ...mapInsumoToDB(insumo), ativo: true })
    .select()
    .single()

  if (error) throw error
  return mapInsumoFromDB(data)
}

export const updateInsumo = async (id, insumo) => {
  const { data, error } = await supabase
    .from('insumos')
    .update({ ...mapInsumoToDB(insumo), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapInsumoFromDB(data)
}

export const deleteInsumo = async (id) => {
  const { error } = await supabase
    .from('insumos')
    .update({ ativo: false })
    .eq('id', id)

  if (error) throw error
  return true
}

// ============ PRATOS ============
export const getPratos = async () => {
  const { data, error } = await supabase
    .from('pratos')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  if (error) throw error
  return (data || []).map(mapPratoFromDB)
}

export const addPrato = async (prato) => {
  const { data, error } = await supabase
    .from('pratos')
    .insert({ ...mapPratoToDB(prato), ativo: true })
    .select()
    .single()

  if (error) throw error
  return mapPratoFromDB(data)
}

export const updatePrato = async (id, prato) => {
  const { data, error } = await supabase
    .from('pratos')
    .update({ ...mapPratoToDB(prato), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapPratoFromDB(data)
}

export const deletePrato = async (id) => {
  const { error } = await supabase
    .from('pratos')
    .update({ ativo: false })
    .eq('id', id)

  if (error) throw error
  return true
}

// ============ VENDAS ============
export const getVendas = async () => {
  const { data, error } = await supabase
    .from('vendas')
    .select('*')
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapVendaFromDB)
}

export const getVendasByDate = async (date) => {
  const { data, error } = await supabase
    .from('vendas')
    .select('*')
    .eq('data', date)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapVendaFromDB)
}

export const getVendasByMonth = async (year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`

  const { data, error } = await supabase
    .from('vendas')
    .select('*')
    .gte('data', startDate)
    .lte('data', endDate)
    .order('data', { ascending: false })

  if (error) throw error
  return (data || []).map(mapVendaFromDB)
}

export const addVenda = async (venda) => {
  const vendaDB = mapVendaToDB(venda)
  vendaDB.hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const { data, error } = await supabase
    .from('vendas')
    .insert(vendaDB)
    .select()
    .single()

  if (error) throw error
  return mapVendaFromDB(data)
}

export const deleteVenda = async (id) => {
  const { error } = await supabase
    .from('vendas')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// ============ CUSTOS FIXOS ============
export const getCustosFixos = async () => {
  const { data, error } = await supabase
    .from('custos_fixos')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  if (error) throw error
  return (data || []).map(mapCustoFromDB)
}

export const addCustoFixo = async (custo) => {
  const { data, error } = await supabase
    .from('custos_fixos')
    .insert({ ...mapCustoToDB(custo), ativo: true })
    .select()
    .single()

  if (error) throw error
  return mapCustoFromDB(data)
}

export const updateCustoFixo = async (id, custo) => {
  const { data, error } = await supabase
    .from('custos_fixos')
    .update({ ...mapCustoToDB(custo), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapCustoFromDB(data)
}

export const deleteCustoFixo = async (id) => {
  const { error } = await supabase
    .from('custos_fixos')
    .update({ ativo: false })
    .eq('id', id)

  if (error) throw error
  return true
}

// ============ DESPESAS NAO OPERACIONAIS ============
export const getDespesasNaoOp = async () => {
  const { data, error } = await supabase
    .from('despesas_nao_operacionais')
    .select('*')
    .order('mes_ano', { ascending: false })

  if (error) throw error
  return (data || []).map(mapDespesaFromDB)
}

export const addDespesaNaoOp = async (despesa) => {
  const { data, error } = await supabase
    .from('despesas_nao_operacionais')
    .insert(mapDespesaToDB(despesa))
    .select()
    .single()

  if (error) throw error
  return mapDespesaFromDB(data)
}

export const deleteDespesaNaoOp = async (id) => {
  const { error } = await supabase
    .from('despesas_nao_operacionais')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export default supabase
