import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext'
import { TutorialProvider } from './contexts/TutorialContext'
import { ToastProvider } from './contexts/ToastContext'

// Layout
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'

// Pages
import Dashboard from './pages/Dashboard'
import Vendas from './pages/Vendas'
import Pratos from './pages/Pratos'
import Insumos from './pages/Insumos'
import CustosFixos from './pages/CustosFixos'
import DRE from './pages/DRE'
import Configuracoes from './pages/Configuracoes'
import Suporte from './pages/Suporte'
import Tutorial from './pages/Tutorial'

// Components
import Toast from './components/ui/Toast'
import TutorialOverlay from './components/tutorial/TutorialOverlay'

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <TutorialProvider>
          <ToastProvider>
            <div className="min-h-screen min-h-dvh bg-gray-100 flex flex-col">
              <Header />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/vendas" element={<Vendas />} />
                  <Route path="/pratos" element={<Pratos />} />
                  <Route path="/insumos" element={<Insumos />} />
                  <Route path="/custos" element={<CustosFixos />} />
                  <Route path="/dre" element={<DRE />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                  <Route path="/suporte" element={<Suporte />} />
                  <Route path="/tutorial" element={<Tutorial />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <BottomNav />
              <Toast />
              <TutorialOverlay />
            </div>
          </ToastProvider>
        </TutorialProvider>
      </DataProvider>
    </BrowserRouter>
  )
}

export default App
