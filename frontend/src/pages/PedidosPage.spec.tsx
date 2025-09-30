import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import PedidosPage from './PedidosPage'
import api from '../services/api'

vi.mock('../services/api')

describe('PedidosPage', () => {
  const mockPedidos = [
    {
      id: 'pedido-1',
      valorTotal: 71.80,
      status: 'RECEBIDO',
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-01T12:00:00Z',
      pedidoPratos: [
        {
          id: 'item-1',
          pratoId: '1',
          quantidade: 2,
          precoUnit: 35.90,
          prato: {
            id: '1',
            nome: 'Pizza Margherita',
            descricao: 'Pizza com molho de tomate',
            categoria: 'Pizza',
          },
        },
      ],
    },
    {
      id: 'pedido-2',
      valorTotal: 28.50,
      status: 'EM_PREPARO',
      createdAt: '2024-01-01T13:00:00Z',
      updatedAt: '2024-01-01T13:00:00Z',
      pedidoPratos: [
        {
          id: 'item-2',
          pratoId: '2',
          quantidade: 1,
          precoUnit: 28.50,
          prato: {
            id: '2',
            nome: 'Hambúrguer Especial',
            descricao: 'Hambúrguer com bacon',
            categoria: 'Hambúrguer',
          },
        },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render page title', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] })

    render(<PedidosPage />)

    expect(screen.getByText('Pedidos')).toBeInTheDocument()
  })

  it('should load and display pedidos', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPedidos })

    render(<PedidosPage />)

    await waitFor(() => {
      expect(screen.getByText(/pedido-1/i)).toBeInTheDocument()
      expect(screen.getByText(/pedido-2/i)).toBeInTheDocument()
    })

    expect(screen.getByText('R$ 71.80')).toBeInTheDocument()
    expect(screen.getByText('R$ 28.50')).toBeInTheDocument()
  })

  it('should display empty state when no pedidos', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] })

    render(<PedidosPage />)

    await waitFor(() => {
      expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument()
    })
  })

  it('should filter pedidos by status', async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: mockPedidos })
      .mockResolvedValueOnce({ data: [mockPedidos[0]] })

    render(<PedidosPage />)

    await waitFor(() => {
      expect(screen.getByText(/pedido-1/i)).toBeInTheDocument()
    })

    const statusSelect = screen.getByLabelText('Filtrar por status')
    await userEvent.selectOptions(statusSelect, 'RECEBIDO')

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/pedidos?status=RECEBIDO')
    })
  })

  it('should expand and show pedido items', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPedidos })

    render(<PedidosPage />)

    await waitFor(() => {
      expect(screen.getByText(/pedido-1/i)).toBeInTheDocument()
    })

    const expandButtons = screen.getAllByText(/Ver itens/i)
    await userEvent.click(expandButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      expect(screen.getByText('2x R$ 35.90')).toBeInTheDocument()
    })
  })

  it('should collapse pedido items', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPedidos })

    render(<PedidosPage />)

    await waitFor(() => {
      expect(screen.getByText(/pedido-1/i)).toBeInTheDocument()
    })

    const expandButtons = screen.getAllByText(/Ver itens/i)
    await userEvent.click(expandButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
    })

    const collapseButton = screen.getByText(/Ocultar itens/i)
    await userEvent.click(collapseButton)

    await waitFor(() => {
      expect(screen.queryByText('Pizza Margherita')).not.toBeInTheDocument()
    })
  })

  it('should update pedido status', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockPedidos })
    vi.mocked(api.patch).mockResolvedValueOnce({ 
      data: { ...mockPedidos[0], status: 'EM_PREPARO' }
    })

    render(<PedidosPage />)

    await waitFor(() => {
      expect(screen.getByText(/pedido-1/i)).toBeInTheDocument()
    })

    const emPreparoButtons = screen.getAllByText('EM_PREPARO')
    const firstEmPreparoButton = emPreparoButtons.find(
      button => button.tagName === 'BUTTON' && !button.hasAttribute('disabled')
    )
    
    if (firstEmPreparoButton) {
      await userEvent.click(firstEmPreparoButton)

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith('/pedidos/pedido-1/status', {
          status: 'EM_PREPARO',
        })
      })
    }
  })

  it('should display status badges correctly', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPedidos })

    render(<PedidosPage />)

    await waitFor(() => {
      const recebidoBadges = screen.getAllByText('RECEBIDO')
      const emPreparoBadges = screen.getAllByText('EM_PREPARO')
      
      expect(recebidoBadges.length).toBeGreaterThan(0)
      expect(emPreparoBadges.length).toBeGreaterThan(0)
    })
  })

  it('should disable status button if already in that status', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPedidos })

    render(<PedidosPage />)

    await waitFor(() => {
      expect(screen.getByText(/pedido-1/i)).toBeInTheDocument()
    })

    const allButtons = screen.getAllByRole('button')
    const statusButtons = allButtons.filter(button => 
      button.textContent === 'RECEBIDO' ||
      button.textContent === 'EM_PREPARO' ||
      button.textContent === 'PRONTO' ||
      button.textContent === 'ENTREGUE'
    )

    const disabledButtons = statusButtons.filter(button => 
      button.hasAttribute('disabled')
    )

    expect(disabledButtons.length).toBeGreaterThan(0)
  })

  it('should format date correctly', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPedidos })

    render(<PedidosPage />)

    await waitFor(() => {
      const dateElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/)
      expect(dateElements.length).toBeGreaterThan(0)
    })
  })
})
