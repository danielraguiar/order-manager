import { useState, useEffect } from 'react'
import api from '../services/api'
import { Prato } from '../types'

function PratosPage() {
  const [pratos, setPratos] = useState<Prato[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrato, setEditingPrato] = useState<Prato | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        preco: parseFloat(formData.preco),
      }

      if (editingPrato) {
        await api.patch(`/pratos/${editingPrato.id}`, data)
      } else {
        await api.post('/pratos', data)
      }

      setIsModalOpen(false)
      resetForm()
      loadPratos()
    } catch (error) {
      alert('Erro ao salvar prato')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente deletar este prato?')) return

    try {
      await api.delete(`/pratos/${id}`)
      loadPratos()
    } catch (error) {
      alert('Erro ao deletar prato')
    }
  }

  const handleEdit = (prato: Prato) => {
    setEditingPrato(prato)
    setFormData({
      nome: prato.nome,
      descricao: prato.descricao,
      preco: prato.preco.toString(),
      categoria: prato.categoria,
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
    })
    setEditingPrato(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Novo Prato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pratos.map((prato) => (
          <div key={prato.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900">{prato.nome}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {prato.categoria}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{prato.descricao}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">
                R$ {Number(prato.preco).toFixed(2)}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(prato)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prato.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingPrato ? 'Editar Prato' : 'Novo Prato'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="prato-nome" className="block text-gray-700 font-medium mb-2">Nome</label>
                <input
                  id="prato-nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="prato-descricao" className="block text-gray-700 font-medium mb-2">Descrição</label>
                <textarea
                  id="prato-descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="prato-preco" className="block text-gray-700 font-medium mb-2">Preço</label>
                <input
                  id="prato-preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="prato-categoria" className="block text-gray-700 font-medium mb-2">Categoria</label>
                <input
                  id="prato-categoria"
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingPrato ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PratosPage
