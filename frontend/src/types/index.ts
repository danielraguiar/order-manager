export interface Prato {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  createdAt: string
  updatedAt: string
}

export interface ItemPedido {
  pratoId: string
  quantidade: number
}

export interface PedidoPrato {
  id: string
  pratoId: string
  quantidade: number
  precoUnit: number
  prato: {
    id: string
    nome: string
    descricao: string
    categoria: string
  }
}

export interface Pedido {
  id: string
  valorTotal: number
  status: 'RECEBIDO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE'
  pedidoPratos: PedidoPrato[]
  createdAt: string
  updatedAt: string
}

export interface CreatePedidoDto {
  itens: ItemPedido[]
}
