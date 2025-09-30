import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Prato, CreatePedidoDto } from '../types'

interface CarrinhoItem {
  prato: Prato
  quantidade: number
}

function CriarPedidoPage() {
  const navigate = useNavigate()
  const [pratos, setPratos] = useState<Prato[]>([])
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([])
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('')

  useEffect(() => {
    loadPratos()
  }, [])

  const loadPratos = async () => {
    try {
      const response = await api.get<Prato[]>('/pratos')
      setPratos(response.data)
    } catch (error) {
      alert('Erro ao carregar pratos')
    }
  }

  const categorias = Array.from(new Set(pratos.map(p => p.categoria)))

  const pratosFiltrados = categoriaFiltro
    ? pratos.filter(p => p.categoria === categoriaFiltro)
    : pratos

  const adicionarAoCarrinho = (prato: Prato) => {
    const itemExistente = carrinho.find(item => item.prato.id === prato.id)
    if (itemExistente) {
      setCarrinho(
        carrinho.map(item =>
          item.prato.id === prato.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      )
    } else {
      setCarrinho([...carrinho, { prato, quantidade: 1 }])
    }
  }

  const removerDoCarrinho = (pratoId: string) => {
    setCarrinho(carrinho.filter(item => item.prato.id !== pratoId))
  }

  const atualizarQuantidade = (pratoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(pratoId)
      return
    }
    setCarrinho(
      carrinho.map(item =>
        item.prato.id === pratoId ? { ...item, quantidade } : item
      )
    )
  }

  const calcularTotal = () => {
    return carrinho.reduce(
      (total, item) => total + Number(item.prato.preco) * item.quantidade,
      0
    )
  }

  const finalizarPedido = async () => {
    if (carrinho.length === 0) {
      alert('Adicione itens ao pedido')
      return
    }

    try {
      const pedidoData: CreatePedidoDto = {
        itens: carrinho.map(item => ({
          pratoId: item.prato.id,
          quantidade: item.quantidade,
        })),
      }

      await api.post('/pedidos', pedidoData)
      alert('Pedido criado com sucesso!')
      navigate('/pedidos')
    } catch (error) {
      alert('Erro ao criar pedido')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Novo Pedido</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Filtrar por categoria</label>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pratosFiltrados.map((prato) => (
            <div key={prato.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{prato.nome}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                  {prato.categoria}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{prato.descricao}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                  R$ {Number(prato.preco).toFixed(2)}
                </span>
                <button
                  onClick={() => adicionarAoCarrinho(prato)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded transition"
                >
                  + Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carrinho</h2>

          {carrinho.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Carrinho vazio</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {carrinho.map((item) => (
                  <div key={item.prato.id} className="border-b pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.prato.nome}</h4>
                      <button
                        onClick={() => removerDoCarrinho(item.prato.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => atualizarQuantidade(item.prato.id, item.quantidade - 1)}
                          className="bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-medium">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.prato.id, item.quantidade + 1)}
                          className="bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-gray-900">
                        R$ {(Number(item.prato.preco) * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={finalizarPedido}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Finalizar Pedido
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CriarPedidoPage
