import { useEffect, useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../ui/Button'
import { useTutorial } from '../../contexts/TutorialContext'

const TutorialOverlay = () => {
  const {
    activeTutorial,
    currentStep,
    getCurrentStep,
    getTotalSteps,
    nextStep,
    prevStep,
    skipTutorial
  } = useTutorial()

  const [targetRect, setTargetRect] = useState(null)
  const overlayRef = useRef(null)

  const step = getCurrentStep()
  const totalSteps = getTotalSteps()

  // Encontrar e posicionar o elemento alvo
  useEffect(() => {
    if (!step?.target) {
      setTargetRect(null)
      return
    }

    const findTarget = () => {
      const element = document.querySelector(step.target)
      if (element) {
        const rect = element.getBoundingClientRect()
        setTargetRect({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16
        })

        // Scroll para o elemento se necessario
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setTargetRect(null)
      }
    }

    // Aguardar um pouco para o DOM atualizar
    const timer = setTimeout(findTarget, 100)

    // Atualizar no resize
    window.addEventListener('resize', findTarget)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', findTarget)
    }
  }, [step])

  if (!activeTutorial || !step) return null

  // Calcular posicao do tooltip
  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

    const padding = 16
    const tooltipHeight = 200 // Estimativa

    switch (step.position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - targetRect.top + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)'
        }
      case 'bottom':
      default:
        return {
          top: `${targetRect.top + targetRect.height + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)'
        }
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Overlay escuro com recorte */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* Borda do elemento destacado */}
      {targetRect && (
        <div
          className="absolute border-2 border-primary-400 rounded-2xl pointer-events-none animate-pulse"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-white rounded-2xl shadow-xl p-4 max-w-xs w-full mx-4 animate-fade-in"
        style={getTooltipPosition()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            Passo {currentStep + 1} de {totalSteps}
          </span>
          <button
            onClick={skipTutorial}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Titulo */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {step.title}
        </h3>

        {/* Conteudo */}
        <p className="text-gray-600 mb-4">
          {step.content}
        </p>

        {/* Navegacao */}
        <div className="flex items-center justify-between">
          <button
            onClick={skipTutorial}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Pular
          </button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                icon={ChevronLeft}
              >
                Anterior
              </Button>
            )}
            <Button
              size="sm"
              onClick={nextStep}
              icon={currentStep < totalSteps - 1 ? ChevronRight : undefined}
              iconPosition="right"
            >
              {currentStep < totalSteps - 1 ? 'Proximo' : 'Concluir'}
            </Button>
          </div>
        </div>

        {/* Indicadores de progresso */}
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay
