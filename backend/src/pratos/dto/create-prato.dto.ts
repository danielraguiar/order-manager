import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePratoDto {
  @ApiProperty({ example: 'Pizza Margherita', description: 'Nome do prato' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Pizza com molho de tomate, mussarela e manjericão', description: 'Descrição do prato' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 35.90, description: 'Preço do prato' })
  @IsNumber()
  @IsPositive()
  preco: number;

  @ApiProperty({ example: 'Pizza', description: 'Categoria do prato' })
  @IsString()
  @IsNotEmpty()
  categoria: string;
}
