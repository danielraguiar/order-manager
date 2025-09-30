import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StatusPedido {
  RECEBIDO = 'RECEBIDO',
  EM_PREPARO = 'EM_PREPARO',
  PRONTO = 'PRONTO',
  ENTREGUE = 'ENTREGUE',
}

export class UpdatePedidoStatusDto {
  @ApiProperty({ 
    enum: StatusPedido, 
    example: StatusPedido.EM_PREPARO,
    description: 'Novo status do pedido'
  })
  @IsEnum(StatusPedido)
  status: StatusPedido;
}
