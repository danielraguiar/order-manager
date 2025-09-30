import { IsArray, IsNotEmpty, IsString, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemPedidoDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do prato' })
  @IsString()
  @IsNotEmpty()
  pratoId: string;

  @ApiProperty({ example: 2, description: 'Quantidade do prato' })
  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CreatePedidoDto {
  @ApiProperty({ type: [ItemPedidoDto], description: 'Lista de itens do pedido' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}
