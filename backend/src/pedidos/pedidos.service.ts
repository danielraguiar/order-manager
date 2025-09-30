import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PratosService } from '../pratos/pratos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoStatusDto } from './dto/update-pedido-status.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PedidosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pratosService: PratosService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const { itens } = createPedidoDto;

    if (!itens || itens.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um item');
    }

    const pratosData = await Promise.all(
      itens.map(item => this.pratosService.findOne(item.pratoId))
    );

    const valorTotal = itens.reduce((total, item, index) => {
      const prato = pratosData[index];
      return total + (Number(prato.preco) * item.quantidade);
    }, 0);

    return this.prisma.pedido.create({
      data: {
        valorTotal: new Prisma.Decimal(valorTotal),
        pedidoPratos: {
          create: itens.map((item, index) => ({
            pratoId: item.pratoId,
            quantidade: item.quantidade,
            precoUnit: pratosData[index].preco,
          })),
        },
      },
      include: {
        pedidoPratos: {
          include: {
            prato: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                categoria: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};

    return this.prisma.pedido.findMany({
      where,
      include: {
        pedidoPratos: {
          include: {
            prato: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                categoria: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        pedidoPratos: {
          include: {
            prato: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                categoria: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return pedido;
  }

  async updateStatus(id: string, updatePedidoStatusDto: UpdatePedidoStatusDto) {
    await this.findOne(id);

    return this.prisma.pedido.update({
      where: { id },
      data: { status: updatePedidoStatusDto.status as any },
      include: {
        pedidoPratos: {
          include: {
            prato: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                categoria: true,
              },
            },
          },
        },
      },
    });
  }
}
