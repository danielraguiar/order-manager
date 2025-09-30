import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import PratosPage from './PratosPage'
import api from '../services/api'

vi.mock('../services/api')

describe('PratosPage', () => {
  const mockPratos = [
    {
      id: '1',
      nome: 'Pizza Margherita',
      descricao: 'Pizza com molho de tomate e mussarela',
      preco: 35.90,
      categoria: 'Pizza',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      nome: 'Hambúrguer Especial',
      descricao: 'Hambúrguer com bacon e queijo',
      preco: 28.50,
      categoria: 'Hambúrguer',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page title', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] })

    render(<PratosPage />)

    expect(screen.getByText('Cardápio')).toBeInTheDocument()
  })

  it('should load and display pratos', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<PratosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      expect(screen.getByText('Hambúrguer Especial')).toBeInTheDocument()
    })

    expect(screen.getByText('R$ 35.90')).toBeInTheDocument()
    expect(screen.getByText('R$ 28.50')).toBeInTheDocument()
  })

  it('should open modal when clicking new prato button', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] })

    render(<PratosPage />)

    const newButton = screen.getByText('+ Novo Prato')
    await userEvent.click(newButton)

    expect(screen.getByText('Novo Prato')).toBeInTheDocument()
  })

  it('should create a new prato', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    vi.mocked(api.post).mockResolvedValueOnce({ 
      data: { ...mockPratos[0] }
    })

    render(<PratosPage />)

    const newButton = screen.getByText('+ Novo Prato')
    await userEvent.click(newButton)

    const nomeInput = screen.getByLabelText('Nome')
    const descricaoInput = screen.getByLabelText('Descrição')
    const precoInput = screen.getByLabelText('Preço')
    const categoriaInput = screen.getByLabelText('Categoria')

    await userEvent.type(nomeInput, 'Pizza Margherita')
    await userEvent.type(descricaoInput, 'Pizza com molho de tomate')
    await userEvent.type(precoInput, '35.90')
    await userEvent.type(categoriaInput, 'Pizza')

    const createButton = screen.getByText('Criar')
    await userEvent.click(createButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/pratos', {
        nome: 'Pizza Margherita',
        descricao: 'Pizza com molho de tomate',
        preco: 35.90,
        categoria: 'Pizza',
      })
    })
  })

  it('should open edit modal when clicking edit button', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<PratosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByText('Editar')
    await userEvent.click(editButtons[0])

    expect(screen.getByText('Editar Prato')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Pizza Margherita')).toBeInTheDocument()
  })

  it('should update a prato', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockPratos })
    vi.mocked(api.patch).mockResolvedValueOnce({ 
      data: { ...mockPratos[0], preco: 39.90 }
    })

    render(<PratosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByText('Editar')
    await userEvent.click(editButtons[0])

    const precoInput = screen.getByLabelText('Preço')
    await userEvent.clear(precoInput)
    await userEvent.type(precoInput, '39.90')

    const updateButton = screen.getByText('Atualizar')
    await userEvent.click(updateButton)

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith('/pratos/1', expect.objectContaining({
        preco: 39.90,
      }))
    })
  })

  it('should delete a prato', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockPratos })
    vi.mocked(api.delete).mockResolvedValueOnce({ data: {} })

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<PratosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Deletar')
    await userEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/pratos/1')
    })

    confirmSpy.mockRestore()
  })

  it('should not delete when user cancels', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockPratos })
    
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<PratosPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Deletar')
    await userEvent.click(deleteButtons[0])

    expect(api.delete).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })
})
