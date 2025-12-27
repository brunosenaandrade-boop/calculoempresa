// Configuracoes padrao do sistema
export const CONFIG_PADRAO = {
  nomeEmpresa: 'Selma Restaurante',
  taxaSimples: 7,
  taxaCartao: 3,
  custoFixoPercent: 30,
  lucroDesejado: 15,
  metaDiaria: 2000,
  suporteTelefone: '48-99864-9898',
  tutorialConcluido: false
}

// Categorias
export const CATEGORIAS_PRATOS = [
  'Pratos Principais',
  'Lanches',
  'Bebidas',
  'Sobremesas',
  'Porcoes',
  'Outros'
]

export const CATEGORIAS_CUSTOS = [
  'Infraestrutura',
  'Pessoal',
  'Servicos',
  'Impostos',
  'Outros'
]

export const TIPOS_DESPESA_NAO_OP = [
  { value: 'EMPRESTIMO', label: 'Emprestimo' },
  { value: 'INVESTIMENTO', label: 'Investimento' },
  { value: 'PARCELAMENTO', label: 'Parcelamento' },
  { value: 'OUTROS', label: 'Outros' }
]

// Unidades de medida
export const UNIDADES = [
  { value: 'KG', label: 'Quilograma (kg)' },
  { value: 'G', label: 'Grama (g)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'ML', label: 'Mililitro (ml)' },
  { value: 'UN', label: 'Unidade' },
  { value: 'PCT', label: 'Pacote' },
  { value: 'CX', label: 'Caixa' }
]

// Formas de pagamento
export const FORMAS_PAGAMENTO = [
  { value: 'PIX', label: 'PIX', icon: 'Smartphone' },
  { value: 'CARTAO', label: 'Cartao', icon: 'CreditCard' },
  { value: 'DINHEIRO', label: 'Dinheiro', icon: 'Banknote' }
]

// Meses
export const MESES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

// Dias da semana
export const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

// Cores para graficos
export const CORES_GRAFICO = {
  primaria: '#2563EB',
  secundaria: '#60A5FA',
  sucesso: '#10B981',
  alerta: '#F59E0B',
  perigo: '#EF4444',
  neutro: '#6B7280'
}

// Contato suporte
export const SUPORTE = {
  telefone: '48-99864-9898',
  whatsapp: 'https://wa.me/5548998649898',
  mensagemPadrao: 'Ola! Preciso de ajuda com o GestaoFacil.'
}
