import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Settings } from 'lucide-react'

const pageTitles = {
  '/': 'GestaoFacil',
  '/vendas': 'Vendas',
  '/pratos': 'Pratos',
  '/insumos': 'Insumos',
  '/custos': 'Custos Fixos',
  '/dre': 'DRE',
  '/configuracoes': 'Configuracoes',
  '/suporte': 'Suporte',
  '/tutorial': 'Tutorial'
}

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const title = pageTitles[location.pathname] || 'GestaoFacil'

  return (
    <header className="bg-primary-600 text-white sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Botao voltar ou espacador */}
        <div className="w-10">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-primary-700 rounded-full transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        {/* Titulo */}
        <h1 className="text-xl font-bold">
          {title}
        </h1>

        {/* Botao configuracoes */}
        <div className="w-10">
          {isHome && (
            <button
              onClick={() => navigate('/configuracoes')}
              className="p-2 -mr-2 hover:bg-primary-700 rounded-full transition-colors"
              aria-label="Configuracoes"
            >
              <Settings size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
