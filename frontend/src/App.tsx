import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import PratosPage from './pages/PratosPage'
import CriarPedidoPage from './pages/CriarPedidoPage'
import PedidosPage from './pages/PedidosPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold">
                  Cardápio
                </Link>
                <Link to="/novo-pedido" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold">
                  Novo Pedido
                </Link>
                <Link to="/pedidos" className="flex items-center text-gray-700 hover:text-gray-900 font-semibold">
                  Pedidos
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PratosPage />} />
            <Route path="/novo-pedido" element={<CriarPedidoPage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
