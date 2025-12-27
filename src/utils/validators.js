/**
 * Validadores para formularios
 */

// Validar se campo esta preenchido
export const required = (value, message = 'Campo obrigatorio') => {
  if (value === null || value === undefined || value === '') {
    return message
  }
  if (typeof value === 'string' && value.trim() === '') {
    return message
  }
  return null
}

// Validar valor minimo
export const minValue = (min, message) => (value) => {
  if (value < min) {
    return message || `Valor minimo: ${min}`
  }
  return null
}

// Validar valor maximo
export const maxValue = (max, message) => (value) => {
  if (value > max) {
    return message || `Valor maximo: ${max}`
  }
  return null
}

// Validar tamanho minimo de string
export const minLength = (min, message) => (value) => {
  if (typeof value === 'string' && value.length < min) {
    return message || `Minimo ${min} caracteres`
  }
  return null
}

// Validar tamanho maximo de string
export const maxLength = (max, message) => (value) => {
  if (typeof value === 'string' && value.length > max) {
    return message || `Maximo ${max} caracteres`
  }
  return null
}

// Validar email
export const email = (value, message = 'Email invalido') => {
  if (!value) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return message
  }
  return null
}

// Validar telefone brasileiro
export const phone = (value, message = 'Telefone invalido') => {
  if (!value) return null
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length < 10 || cleaned.length > 11) {
    return message
  }
  return null
}

// Validar valor monetario
export const currency = (value, message = 'Valor invalido') => {
  if (value === null || value === undefined) return null
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    return message
  }
  return null
}

// Validar percentual (0-100)
export const percent = (value, message = 'Percentual invalido') => {
  if (value === null || value === undefined) return null
  if (typeof value !== 'number' || isNaN(value) || value < 0 || value > 100) {
    return message
  }
  return null
}

// Combinar validadores
export const compose = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return null
}

// Validar objeto inteiro
export const validateForm = (values, rules) => {
  const errors = {}
  let isValid = true

  for (const [field, validators] of Object.entries(rules)) {
    const value = values[field]
    const fieldValidators = Array.isArray(validators) ? validators : [validators]

    for (const validator of fieldValidators) {
      const error = typeof validator === 'function'
        ? validator(value)
        : null

      if (error) {
        errors[field] = error
        isValid = false
        break
      }
    }
  }

  return { errors, isValid }
}

// Validadores especificos do sistema
export const validarInsumo = (data) => {
  return validateForm(data, {
    nome: [required],
    unidade: [required],
    precoUnitario: [required, currency, minValue(0)]
  })
}

export const validarPrato = (data) => {
  return validateForm(data, {
    nome: [required, minLength(2)],
    categoria: [required],
    precoVendaReal: [required, currency, minValue(0)]
  })
}

export const validarVenda = (data) => {
  const errors = {}
  let isValid = true

  if (!data.itens || data.itens.length === 0) {
    errors.itens = 'Adicione pelo menos um item'
    isValid = false
  }

  if (!data.formaPagamento) {
    errors.formaPagamento = 'Selecione a forma de pagamento'
    isValid = false
  }

  return { errors, isValid }
}

export const validarCustoFixo = (data) => {
  return validateForm(data, {
    nome: [required],
    valor: [required, currency, minValue(0)],
    categoria: [required]
  })
}
