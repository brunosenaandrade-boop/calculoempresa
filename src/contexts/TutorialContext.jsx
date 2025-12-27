import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const TutorialContext = createContext(null)

// Chave para localStorage
const TUTORIAL_KEY = 'gestaofacil_tutorial'

// Passos do tutorial por tela
export const tutorialSteps = {
  dashboard: [
    {
      target: '[data-tutorial="vendas-hoje"]',
      title: 'Vendas do Dia',
      content: 'Aqui voce ve quanto vendeu hoje e se esta perto da meta.',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="cards-resumo"]',
      title: 'Resumo Rapido',
      content: 'Esses cards mostram quantas vendas e o ticket medio.',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="grafico-vendas"]',
      title: 'Grafico da Semana',
      content: 'Este grafico mostra suas vendas dos ultimos 7 dias.',
      position: 'top'
    },
    {
      target: '[data-tutorial="btn-nova-venda"]',
      title: 'Registrar Venda',
      content: 'Toque aqui para registrar uma nova venda rapidamente!',
      position: 'top'
    }
  ],
  vendas: [
    {
      target: '[data-tutorial="lista-vendas"]',
      title: 'Lista de Vendas',
      content: 'Aqui ficam todas as vendas do dia selecionado.',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="btn-nova-venda"]',
      title: 'Nova Venda',
      content: 'Toque no + para adicionar uma nova venda.',
      position: 'top'
    }
  ],
  pratos: [
    {
      target: '[data-tutorial="lista-pratos"]',
      title: 'Seus Pratos',
      content: 'Aqui ficam todos os pratos cadastrados com seus precos.',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="btn-novo-prato"]',
      title: 'Novo Prato',
      content: 'Toque no + para criar um novo prato.',
      position: 'top'
    }
  ],
  dre: [
    {
      target: '[data-tutorial="resultado-mes"]',
      title: 'Resultado do Mes',
      content: 'Este e o lucro (ou prejuizo) do mes selecionado.',
      position: 'bottom'
    },
    {
      target: '[data-tutorial="tabela-dre"]',
      title: 'Detalhamento',
      content: 'Veja de onde vem e para onde vai o dinheiro.',
      position: 'top'
    },
    {
      target: '[data-tutorial="cores-indicadores"]',
      title: 'Cores',
      content: 'Verde = bom, Amarelo = atencao, Vermelho = cuidado.',
      position: 'top'
    }
  ]
}

export const TutorialProvider = ({ children }) => {
  const [completedTutorials, setCompletedTutorials] = useState(() => {
    try {
      const saved = localStorage.getItem(TUTORIAL_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [activeTutorial, setActiveTutorial] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem(TUTORIAL_KEY, JSON.stringify(completedTutorials))
  }, [completedTutorials])

  // Iniciar tutorial de uma tela
  const startTutorial = useCallback((screen) => {
    const steps = tutorialSteps[screen]
    if (steps && steps.length > 0) {
      setActiveTutorial(screen)
      setCurrentStep(0)
    }
  }, [])

  // Verificar se deve mostrar tutorial
  const shouldShowTutorial = useCallback((screen) => {
    return !completedTutorials[screen] && tutorialSteps[screen]
  }, [completedTutorials])

  // Proximo passo
  const nextStep = useCallback(() => {
    const steps = tutorialSteps[activeTutorial]
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }, [activeTutorial, currentStep])

  // Passo anterior
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  // Completar tutorial
  const completeTutorial = useCallback(() => {
    if (activeTutorial) {
      setCompletedTutorials((prev) => ({
        ...prev,
        [activeTutorial]: true
      }))
    }
    setActiveTutorial(null)
    setCurrentStep(0)
  }, [activeTutorial])

  // Pular tutorial
  const skipTutorial = useCallback(() => {
    completeTutorial()
  }, [completeTutorial])

  // Resetar todos os tutoriais
  const resetAllTutorials = useCallback(() => {
    setCompletedTutorials({})
    localStorage.removeItem(TUTORIAL_KEY)
  }, [])

  // Obter passo atual
  const getCurrentStep = useCallback(() => {
    if (!activeTutorial) return null
    const steps = tutorialSteps[activeTutorial]
    return steps ? steps[currentStep] : null
  }, [activeTutorial, currentStep])

  // Total de passos
  const getTotalSteps = useCallback(() => {
    if (!activeTutorial) return 0
    const steps = tutorialSteps[activeTutorial]
    return steps ? steps.length : 0
  }, [activeTutorial])

  return (
    <TutorialContext.Provider
      value={{
        activeTutorial,
        currentStep,
        completedTutorials,
        startTutorial,
        shouldShowTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        resetAllTutorials,
        getCurrentStep,
        getTotalSteps
      }}
    >
      {children}
    </TutorialContext.Provider>
  )
}

export const useTutorial = () => {
  const context = useContext(TutorialContext)
  if (!context) {
    throw new Error('useTutorial deve ser usado dentro de TutorialProvider')
  }
  return context
}
