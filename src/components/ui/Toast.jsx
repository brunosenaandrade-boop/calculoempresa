import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const colors = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-white',
  info: 'bg-primary-600 text-white'
}

const Toast = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

const ToastItem = ({ toast, onClose }) => {
  const Icon = icons[toast.type] || Info

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(onClose, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onClose])

  return (
    <div
      className={`
        ${colors[toast.type]}
        rounded-xl shadow-lg p-4
        flex items-start gap-3
        animate-slide-up
      `}
    >
      <Icon size={24} className="flex-shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold">{toast.title}</p>
        )}
        <p className={toast.title ? 'text-sm opacity-90' : ''}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast
