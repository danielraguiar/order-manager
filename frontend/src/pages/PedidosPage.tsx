import { useState, useEffect } from 'react'
import api from '../services/api'
import { Pedido } from '../types'

const STATUS_OPTIONS = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE']

const STATUS_COLORS = {
  RECEBIDO: 'bg-blue-100 text-blue-800',
  EM_PREPARO: 'bg-yellow-100 text-yellow-800',
  PRONTO: 'bg-purple-100 text-purple-800',
  ENTREGUE: 'bg-green-100 text-green-800',
}

function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null)

  useEffect(() => {
    loadPedidos()
  }, [filtroStatus])

  const loadPedidos = async () => {
    try {
      const url = filtroStatus ? `/pedidos?status=${filtroStatus}` : '/pedidos'
      const response = await api.get<Pedido[]>(url)
      setPedidos(response.data)
    } catch (error) {
      alert('Erro ao carregar pedidos')
    }
  }

  const atualizarStatus = async (pedidoId: string, novoStatus: string) => {
    try {
      await api.patch(`/pedidos/${pedidoId}/status`, { status: novoStatus })
      loadPedidos()
    } catch (error) {
      alert('Erro ao atualizar status')
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR')
  }

  const toggleExpandir = (pedidoId: string) => {
    setPedidoExpandido(pedidoExpandido === pedidoId ? null : pedidoId)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
      </div>

      <div className="mb-6">
        <label htmlFor="filtro-status" className="block text-gray-700 font-medium mb-2">Filtrar por status</label>
        <select
          id="filtro-status"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Nenhum pedido encontrado
          </div>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div className="mb-2 md:mb-0">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Pedido #{pedido.id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">{formatarData(pedido.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[pedido.status]}`}>
                      {pedido.status}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {Number(pedido.valorTotal).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                  <button
                    onClick={() => toggleExpandir(pedido.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-left"
                  >
                    {pedidoExpandido === pedido.id ? '▼ Ocultar itens' : '▶ Ver itens'}
                  </button>

                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(status => (
                      <button
                        key={status}
                        onClick={() => atualizarStatus(pedido.id, status)}
                        disabled={pedido.status === status}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          pedido.status === status
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {pedidoExpandido === pedido.id && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Itens do pedido:</h4>
                    <div className="space-y-2">
                      {pedido.pedidoPratos.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <p className="font-medium text-gray-900">{item.prato.nome}</p>
                            <p className="text-sm text-gray-600">{item.prato.categoria}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {item.quantidade}x R$ {Number(item.precoUnit).toFixed(2)}
                            </p>
                            <p className="text-sm font-semibold text-green-600">
                              R$ {(Number(item.precoUnit) * item.quantidade).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PedidosPage
