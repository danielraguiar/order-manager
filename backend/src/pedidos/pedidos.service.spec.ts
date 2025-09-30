import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PrismaService } from '../prisma/prisma.service';
import { PratosService } from '../pratos/pratos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoStatusDto, StatusPedido } from './dto/update-pedido-status.dto';
import { Prisma } from '@prisma/client';

describe('PedidosService', () => {
  let service: PedidosService;
  let prismaService: PrismaService;
  let pratosService: PratosService;

  const mockPrato = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'Pizza Margherita',
    descricao: 'Pizza com molho de tomate, mussarela e manjericão',
    preco: 35.90,
    categoria: 'Pizza',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPedido = {
    id: 'pedido-123',
    valorTotal: new Prisma.Decimal(71.80),
    status: 'RECEBIDO',
    createdAt: new Date(),
    updatedAt: new Date(),
    pedidoPratos: [
      {
        id: 'item-1',
        pedidoId: 'pedido-123',
        pratoId: mockPrato.id,
        quantidade: 2,
        precoUnit: new Prisma.Decimal(35.90),
        createdAt: new Date(),
        prato: {
          id: mockPrato.id,
          nome: mockPrato.nome,
          descricao: mockPrato.descricao,
          categoria: mockPrato.categoria,
        },
      },
    ],
  };

  const mockPrismaService = {
    pedido: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPratosService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PratosService,
          useValue: mockPratosService,
        },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
    prismaService = module.get<PrismaService>(PrismaService);
    pratosService = module.get<PratosService>(PratosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const createPedidoDto: CreatePedidoDto = {
        itens: [
          {
            pratoId: mockPrato.id,
            quantidade: 2,
          },
        ],
      };

      mockPratosService.findOne.mockResolvedValue(mockPrato);
      mockPrismaService.pedido.create.mockResolvedValue(mockPedido);

      const result = await service.create(createPedidoDto);

      expect(result).toEqual(mockPedido);
      expect(pratosService.findOne).toHaveBeenCalledWith(mockPrato.id);
      expect(prismaService.pedido.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when itens is empty', async () => {
      const createPedidoDto: CreatePedidoDto = {
        itens: [],
      };

      await expect(service.create(createPedidoDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createPedidoDto)).rejects.toThrow(
        'O pedido deve conter pelo menos um item',
      );
    });

    it('should calculate total value correctly', async () => {
      const createPedidoDto: CreatePedidoDto = {
        itens: [
          {
            pratoId: mockPrato.id,
            quantidade: 2,
          },
        ],
      };

      mockPratosService.findOne.mockResolvedValue(mockPrato);
      mockPrismaService.pedido.create.mockResolvedValue(mockPedido);

      await service.create(createPedidoDto);

      expect(mockPrismaService.pedido.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            valorTotal: expect.any(Prisma.Decimal),
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all pedidos', async () => {
      const mockPedidos = [mockPedido];
      mockPrismaService.pedido.findMany.mockResolvedValue(mockPedidos);

      const result = await service.findAll();

      expect(result).toEqual(mockPedidos);
      expect(mockPrismaService.pedido.findMany).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Object),
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return pedidos filtered by status', async () => {
      const mockPedidos = [mockPedido];
      mockPrismaService.pedido.findMany.mockResolvedValue(mockPedidos);

      const result = await service.findAll('RECEBIDO');

      expect(result).toEqual(mockPedidos);
      expect(mockPrismaService.pedido.findMany).toHaveBeenCalledWith({
        where: { status: 'RECEBIDO' },
        include: expect.any(Object),
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      mockPrismaService.pedido.findUnique.mockResolvedValue(mockPedido);

      const result = await service.findOne(mockPedido.id);

      expect(result).toEqual(mockPedido);
      expect(mockPrismaService.pedido.findUnique).toHaveBeenCalledWith({
        where: { id: mockPedido.id },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when pedido is not found', async () => {
      mockPrismaService.pedido.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Pedido com ID non-existent-id não encontrado',
      );
    });
  });

  describe('updateStatus', () => {
    it('should update pedido status', async () => {
      const updateDto: UpdatePedidoStatusDto = {
        status: StatusPedido.EM_PREPARO,
      };

      const updatedPedido = { ...mockPedido, status: 'EM_PREPARO' };

      mockPrismaService.pedido.findUnique.mockResolvedValue(mockPedido);
      mockPrismaService.pedido.update.mockResolvedValue(updatedPedido);

      const result = await service.updateStatus(mockPedido.id, updateDto);

      expect(result).toEqual(updatedPedido);
      expect(mockPrismaService.pedido.update).toHaveBeenCalledWith({
        where: { id: mockPedido.id },
        data: { status: updateDto.status },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when pedido is not found', async () => {
      mockPrismaService.pedido.findUnique.mockResolvedValue(null);

      const updateDto: UpdatePedidoStatusDto = {
        status: StatusPedido.EM_PREPARO,
      };

      await expect(
        service.updateStatus('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
