import { useState, useMemo, useEffect } from 'react'
import { Plus, X, AlertCircle } from 'lucide-react'
import Button from '../ui/Button'
import Input, { CurrencyInput, NumberInput } from '../ui/Input'
import Select from '../ui/Select'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatters'
import { CATEGORIAS_PRATOS, UNIDADES } from '../../utils/constants'
import { calcularCustoPrato, calcularPrecoVendaSugerido, calcularMargemReal } from '../../services/calculadora'
import { useData } from '../../contexts/DataContext'

const FormPrato = ({ prato, insumos, onSubmit, onCancel }) => {
  const { configuracoes } = useData()

  const [nome, setNome] = useState(prato?.nome || '')
  const [categoria, setCategoria] = useState(prato?.categoria || '')
  const [ingredientes, setIngredientes] = useState(prato?.ingredientes || [])
  const [precoVendaReal, setPrecoVendaReal] = useState(prato?.precoVendaReal || 0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Calculos automaticos
  const custoTotal = useMemo(() => {
    return calcularCustoPrato(ingredientes, insumos)
  }, [ingredientes, insumos])

  const precoSugerido = useMemo(() => {
    return calcularPrecoVendaSugerido(custoTotal, configuracoes)
  }, [custoTotal, configuracoes])

  const margemReal = useMemo(() => {
    return calcularMargemReal(precoVendaReal, custoTotal, configuracoes)
  }, [precoVendaReal, custoTotal, configuracoes])

  // Estado para adicionar ingrediente
  const [novoIngrediente, setNovoIngrediente] = useState({
    insumoId: '',
    quantidade: 0
  })

  const adicionarIngrediente = () => {
    if (!novoIngrediente.insumoId || novoIngrediente.quantidade <= 0) return

    const insumo = insumos.find((i) => i.id === novoIngrediente.insumoId)
    if (!insumo) return

    // Verificar se ja existe
    const existe = ingredientes.find((ing) => ing.insumoId === novoIngrediente.insumoId)
    if (existe) {
      // Atualizar quantidade
      setIngredientes((prev) =>
        prev.map((ing) =>
          ing.insumoId === novoIngrediente.insumoId
            ? { ...ing, quantidade: ing.quantidade + novoIngrediente.quantidade }
            : ing
        )
      )
    } else {
      setIngredientes((prev) => [
        ...prev,
        {
          insumoId: insumo.id,
          insumoNome: insumo.nome,
          quantidade: novoIngrediente.quantidade,
          unidade: insumo.unidade
        }
      ])
    }

    setNovoIngrediente({ insumoId: '', quantidade: 0 })
    setErrors((prev) => ({ ...prev, ingredientes: null }))
  }

  const removerIngrediente = (insumoId) => {
    setIngredientes((prev) => prev.filter((ing) => ing.insumoId !== insumoId))
  }

  const handleSubmit = async () => {
    const newErrors = {}

    if (!nome.trim()) newErrors.nome = 'Nome obrigatorio'
    if (!categoria) newErrors.categoria = 'Categoria obrigatoria'
    if (ingredientes.length === 0) newErrors.ingredientes = 'Adicione pelo menos um ingrediente'
    if (precoVendaReal <= 0) newErrors.precoVendaReal = 'Informe o preco de venda'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        nome: nome.trim(),
        categoria,
        ingredientes,
        custoTotal,
        precoVendaSugerido: precoSugerido,
        precoVendaReal,
        margemReal
      })
    } finally {
      setLoading(false)
    }
  }

  const categoriasOptions = CATEGORIAS_PRATOS.map((cat) => ({
    value: cat,
    label: cat
  }))

  const insumosOptions = insumos.map((ins) => ({
    value: ins.id,
    label: `${ins.nome} (${formatCurrency(ins.precoUnitario)}/${ins.unidade})`
  }))

  const margemColor = margemReal >= 30 ? 'text-success' : margemReal >= 15 ? 'text-warning' : 'text-danger'
  const margemBaixo = precoVendaReal > 0 && margemReal < 15

  return (
    <div className="space-y-4">
      {/* Nome e Categoria */}
      <Input
        label="Nome do Prato"
        value={nome}
        onChange={(e) => {
          setNome(e.target.value)
          setErrors((prev) => ({ ...prev, nome: null }))
        }}
        placeholder="Ex: File a Parmegiana"
        error={errors.nome}
        required
      />

      <Select
        label="Categoria"
        options={categoriasOptions}
        value={categoria}
        onChange={(e) => {
          setCategoria(e.target.value)
          setErrors((prev) => ({ ...prev, categoria: null }))
        }}
        error={errors.categoria}
        required
      />

      {/* Ingredientes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredientes
        </label>

        {/* Lista de ingredientes adicionados */}
        {ingredientes.length > 0 && (
          <div className="space-y-2 mb-3">
            {ingredientes.map((ing) => {
              const insumo = insumos.find((i) => i.id === ing.insumoId)
              const custo = insumo ? insumo.precoUnitario * ing.quantidade : 0

              return (
                <div
                  key={ing.insumoId}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <div>
                    <span className="font-medium">{ing.insumoNome}</span>
                    <span className="text-gray-500 ml-2">
                      {ing.quantidade} {ing.unidade}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {formatCurrency(custo)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerIngrediente(ing.insumoId)}
                      className="p-1 text-gray-400 hover:text-danger"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Adicionar novo ingrediente */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Select
              options={insumosOptions}
              value={novoIngrediente.insumoId}
              onChange={(e) =>
                setNovoIngrediente((prev) => ({ ...prev, insumoId: e.target.value }))
              }
              placeholder="Selecione o insumo"
              containerClassName="!mb-0"
            />
          </div>
          <div className="w-24">
            <NumberInput
              value={novoIngrediente.quantidade || ''}
              onChange={(val) =>
                setNovoIngrediente((prev) => ({ ...prev, quantidade: val }))
              }
              placeholder="Qtd"
              min={0}
              step={0.01}
              containerClassName="!mb-0"
            />
          </div>
          <Button
            type="button"
            onClick={adicionarIngrediente}
            size="icon"
            disabled={!novoIngrediente.insumoId || novoIngrediente.quantidade <= 0}
          >
            <Plus size={20} />
          </Button>
        </div>

        {errors.ingredientes && (
          <p className="text-sm text-danger mt-1">{errors.ingredientes}</p>
        )}
      </div>

      {/* Resumo de custos */}
      {ingredientes.length > 0 && (
        <Card className="bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Custo Total</span>
            <span className="font-semibold">{formatCurrency(custoTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Preco Sugerido</span>
            <span className="font-semibold text-primary-600">
              {formatCurrency(precoSugerido)}
            </span>
          </div>
        </Card>
      )}

      {/* Preco de venda */}
      <div>
        <CurrencyInput
          label="Preco de Venda"
          value={precoVendaReal}
          onChange={(val) => {
            setPrecoVendaReal(val)
            setErrors((prev) => ({ ...prev, precoVendaReal: null }))
          }}
          error={errors.precoVendaReal}
          required
        />

        {precoVendaReal > 0 && (
          <div className={`flex items-center gap-2 mt-1 ${margemColor}`}>
            {margemBaixo && <AlertCircle size={16} />}
            <span className="text-sm font-medium">
              Margem: {margemReal.toFixed(1)}%
              {margemBaixo && ' (muito baixa!)'}
            </span>
          </div>
        )}
      </div>

      {/* Botoes */}
      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onCancel} fullWidth disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} fullWidth loading={loading}>
          {prato ? 'Salvar' : 'Cadastrar'}
        </Button>
      </div>
    </div>
  )
}

export default FormPrato
