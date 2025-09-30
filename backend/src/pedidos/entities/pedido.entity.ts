import { ApiProperty } from '@nestjs/swagger';

export class ItemPedido {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pratoId: string;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  precoUnit: number;

  @ApiProperty()
  prato: {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
  };
}

export class Pedido {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 71.80 })
  valorTotal: number;

  @ApiProperty({ example: 'RECEBIDO' })
  status: string;

  @ApiProperty({ type: [ItemPedido] })
  pedidoPratos: ItemPedido[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
