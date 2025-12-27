import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  className = ''
}) => {
  const modalRef = useRef(null)

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Prevenir scroll do body quando modal esta aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative bg-white w-full ${sizes[size]}
          rounded-t-3xl sm:rounded-2xl
          shadow-xl animate-slide-up
          max-h-[90vh] overflow-hidden
          flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Modal de confirmacao
Modal.Confirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            fullWidth
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            fullWidth
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-600 text-center py-4">{message}</p>
    </Modal>
  )
}

export default Modal
