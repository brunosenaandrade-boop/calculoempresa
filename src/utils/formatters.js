// Formatar valor em Real (BRL)
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Formatar valor sem simbolo da moeda
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0,00'
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

// Formatar percentual
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%'
  }

  return `${formatNumber(value, decimals)}%`
}

// Formatar data para exibicao
export const formatDate = (date) => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

// Formatar data para exibicao longa
export const formatDateLong = (date) => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(d)
}

// Formatar data para armazenamento (YYYY-MM-DD)
export const formatDateISO = (date) => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  return d.toISOString().split('T')[0]
}

// Formatar hora
export const formatTime = (date) => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

// Formatar mes/ano
export const formatMonthYear = (date) => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(d)
}

// Obter mes/ano no formato YYYY-MM
export const getMonthKey = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

// Parser de valor monetario
export const parseCurrency = (value) => {
  if (typeof value === 'number') return value
  if (!value) return 0

  // Remove tudo exceto numeros, virgula e ponto
  const cleaned = value.toString().replace(/[^\d,.-]/g, '')
  // Substitui virgula por ponto
  const normalized = cleaned.replace(',', '.')

  return parseFloat(normalized) || 0
}

// Formatar telefone
export const formatPhone = (phone) => {
  if (!phone) return ''

  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

// Capitalizar primeira letra
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Truncar texto
export const truncate = (str, length = 30) => {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
