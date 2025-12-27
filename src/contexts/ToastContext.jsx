import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId

    setToasts((prev) => [...prev, { id, type, title, message, duration }])

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Atalhos
  const success = useCallback((message, title) => {
    return addToast({ type: 'success', message, title })
  }, [addToast])

  const error = useCallback((message, title) => {
    return addToast({ type: 'error', message, title, duration: 6000 })
  }, [addToast])

  const warning = useCallback((message, title) => {
    return addToast({ type: 'warning', message, title })
  }, [addToast])

  const info = useCallback((message, title) => {
    return addToast({ type: 'info', message, title })
  }, [addToast])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return context
}
