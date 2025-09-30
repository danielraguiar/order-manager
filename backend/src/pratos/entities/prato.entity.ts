import { ApiProperty } from '@nestjs/swagger';

export class Prato {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Pizza Margherita' })
  nome: string;

  @ApiProperty({ example: 'Pizza com molho de tomate, mussarela e manjericão' })
  descricao: string;

  @ApiProperty({ example: 35.90 })
  preco: number;

  @ApiProperty({ example: 'Pizza' })
  categoria: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
