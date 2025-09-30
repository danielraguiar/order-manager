import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePratoDto } from './dto/create-prato.dto';
import { UpdatePratoDto } from './dto/update-prato.dto';

@Injectable()
export class PratosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPratoDto: CreatePratoDto) {
    return this.prisma.prato.create({
      data: createPratoDto,
    });
  }

  async findAll() {
    return this.prisma.prato.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const prato = await this.prisma.prato.findUnique({
      where: { id },
    });

    if (!prato) {
      throw new NotFoundException(`Prato com ID ${id} não encontrado`);
    }

    return prato;
  }

  async update(id: string, updatePratoDto: UpdatePratoDto) {
    await this.findOne(id);

    return this.prisma.prato.update({
      where: { id },
      data: updatePratoDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.prato.delete({
      where: { id },
    });
  }
}
