import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PratosService } from './pratos.service';
import { CreatePratoDto } from './dto/create-prato.dto';
import { UpdatePratoDto } from './dto/update-prato.dto';
import { Prato } from './entities/prato.entity';

@ApiTags('pratos')
@Controller('pratos')
export class PratosController {
  constructor(private readonly pratosService: PratosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo prato' })
  @ApiResponse({ status: 201, description: 'Prato criado com sucesso', type: Prato })
  create(@Body() createPratoDto: CreatePratoDto) {
    return this.pratosService.create(createPratoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pratos' })
  @ApiResponse({ status: 200, description: 'Lista de pratos', type: [Prato] })
  findAll() {
    return this.pratosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um prato por ID' })
  @ApiResponse({ status: 200, description: 'Prato encontrado', type: Prato })
  @ApiResponse({ status: 404, description: 'Prato não encontrado' })
  findOne(@Param('id') id: string) {
    return this.pratosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um prato' })
  @ApiResponse({ status: 200, description: 'Prato atualizado com sucesso', type: Prato })
  @ApiResponse({ status: 404, description: 'Prato não encontrado' })
  update(@Param('id') id: string, @Body() updatePratoDto: UpdatePratoDto) {
    return this.pratosService.update(id, updatePratoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um prato' })
  @ApiResponse({ status: 204, description: 'Prato deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Prato não encontrado' })
  remove(@Param('id') id: string) {
    return this.pratosService.remove(id);
  }
}
