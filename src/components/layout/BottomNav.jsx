import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ShoppingCart, UtensilsCrossed, BarChart3, Menu } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/vendas', icon: ShoppingCart, label: 'Vendas' },
  { path: '/pratos', icon: UtensilsCrossed, label: 'Pratos' },
  { path: '/dre', icon: BarChart3, label: 'DRE' },
  { path: 'more', icon: Menu, label: 'Mais' }
]

const moreItems = [
  { path: '/insumos', label: 'Insumos' },
  { path: '/custos', label: 'Custos Fixos' },
  { path: '/configuracoes', label: 'Configuracoes' },
  { path: '/tutorial', label: 'Tutorial' },
  { path: '/suporte', label: 'Suporte' }
]

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isMoreActive = moreItems.some(item => location.pathname === item.path)

  const handleNavClick = (path) => {
    if (path === 'more') {
      setShowMore(!showMore)
    } else {
      setShowMore(false)
      navigate(path)
    }
  }

  return (
    <>
      {/* Menu "Mais" expandido */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 animate-slide-up pb-safe">
            <div className="p-2">
              {moreItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`
                    w-full text-left px-4 py-3 rounded-xl
                    transition-colors
                    ${location.pathname === item.path
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Navegacao inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.path === 'more' ? isMoreActive || showMore : isActive(item.path)

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  flex flex-col items-center justify-center
                  py-2 px-4 min-w-[64px]
                  transition-colors
                  ${active
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-xs mt-1 ${active ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default BottomNav
