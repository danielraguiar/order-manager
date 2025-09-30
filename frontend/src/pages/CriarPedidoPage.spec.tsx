import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import CriarPedidoPage from './CriarPedidoPage'
import api from '../services/api'

const mockNavigate = vi.fn()

vi.mock('../services/api')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('CriarPedidoPage', () => {
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
    {
      id: '3',
      nome: 'Refrigerante',
      descricao: 'Refrigerante 350ml',
      preco: 6.00,
      categoria: 'Bebida',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page title and empty cart', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    expect(screen.getByText('Novo Pedido')).toBeInTheDocument()
    expect(screen.getByText('Carrinho vazio')).toBeInTheDocument()
  })

  it('should load and display pratos', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      expect(screen.getByText('Hambúrguer Especial')).toBeInTheDocument()
      expect(screen.getByText('Refrigerante')).toBeInTheDocument()
    })
  })

  it('should filter pratos by category', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const categorySelect = screen.getByLabelText('Filtrar por categoria')
    await userEvent.selectOptions(categorySelect, 'Pizza')

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      expect(screen.queryByText('Hambúrguer Especial')).not.toBeInTheDocument()
    })
  })

  it('should add item to cart', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('+ Adicionar')
    await userEvent.click(addButtons[0])

    await waitFor(() => {
      expect(screen.queryByText('Carrinho vazio')).not.toBeInTheDocument()
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })
  })

  it('should increase item quantity in cart', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('+ Adicionar')
    await userEvent.click(addButtons[0])

    await waitFor(() => {
      const plusButton = screen.getByText('+')
      expect(plusButton).toBeInTheDocument()
    })

    const plusButton = screen.getByText('+')
    await userEvent.click(plusButton)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should decrease item quantity in cart', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('+ Adicionar')
    await userEvent.click(addButtons[0])

    await waitFor(() => {
      const plusButton = screen.getByText('+')
      expect(plusButton).toBeInTheDocument()
    })

    const plusButton = screen.getByText('+')
    await userEvent.click(plusButton)

    const minusButton = screen.getByText('-')
    await userEvent.click(minusButton)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should remove item from cart', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('+ Adicionar')
    await userEvent.click(addButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Remover')).toBeInTheDocument()
    })

    const removeButton = screen.getByText('Remover')
    await userEvent.click(removeButton)

    expect(screen.getByText('Carrinho vazio')).toBeInTheDocument()
  })

  it('should calculate total correctly', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('+ Adicionar')
    await userEvent.click(addButtons[0])
    await userEvent.click(addButtons[1])

    await waitFor(() => {
      expect(screen.getByText('R$ 64.40')).toBeInTheDocument()
    })
  })

  it('should create pedido successfully', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} })

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText('+ Adicionar')
    await userEvent.click(addButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Finalizar Pedido')).toBeInTheDocument()
    })

    const finalizarButton = screen.getByText('Finalizar Pedido')
    await userEvent.click(finalizarButton)

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/pedidos', {
        itens: [
          {
            pratoId: '1',
            quantidade: 1,
          },
        ],
      })
      expect(mockNavigate).toHaveBeenCalledWith('/pedidos')
    })

    alertSpy.mockRestore()
  })

  it('should show alert when trying to finalize empty cart', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPratos })

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<CriarPedidoPage />)

    await waitFor(() => {
      expect(screen.getByText('Carrinho vazio')).toBeInTheDocument()
    })

    expect(alertSpy).not.toHaveBeenCalled()

    alertSpy.mockRestore()
  })
})
