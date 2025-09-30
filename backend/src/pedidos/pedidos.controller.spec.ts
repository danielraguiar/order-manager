import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoStatusDto, StatusPedido } from './dto/update-pedido-status.dto';
import { Prisma } from '@prisma/client';

describe('PedidosController', () => {
  let controller: PedidosController;
  let service: PedidosService;

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
        pratoId: '123e4567-e89b-12d3-a456-426614174000',
        quantidade: 2,
        precoUnit: new Prisma.Decimal(35.90),
        createdAt: new Date(),
        prato: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          nome: 'Pizza Margherita',
          descricao: 'Pizza com molho de tomate, mussarela e manjericão',
          categoria: 'Pizza',
        },
      },
    ],
  };

  const mockPedidosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosController],
      providers: [
        {
          provide: PedidosService,
          useValue: mockPedidosService,
        },
      ],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
    service = module.get<PedidosService>(PedidosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const createPedidoDto: CreatePedidoDto = {
        itens: [
          {
            pratoId: '123e4567-e89b-12d3-a456-426614174000',
            quantidade: 2,
          },
        ],
      };

      mockPedidosService.create.mockResolvedValue(mockPedido);

      const result = await controller.create(createPedidoDto);

      expect(result).toEqual(mockPedido);
      expect(service.create).toHaveBeenCalledWith(createPedidoDto);
    });
  });

  describe('findAll', () => {
    it('should return all pedidos without filter', async () => {
      const mockPedidos = [mockPedido];
      mockPedidosService.findAll.mockResolvedValue(mockPedidos);

      const result = await controller.findAll();

      expect(result).toEqual(mockPedidos);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return pedidos filtered by status', async () => {
      const mockPedidos = [mockPedido];
      mockPedidosService.findAll.mockResolvedValue(mockPedidos);

      const result = await controller.findAll('RECEBIDO');

      expect(result).toEqual(mockPedidos);
      expect(service.findAll).toHaveBeenCalledWith('RECEBIDO');
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      mockPedidosService.findOne.mockResolvedValue(mockPedido);

      const result = await controller.findOne(mockPedido.id);

      expect(result).toEqual(mockPedido);
      expect(service.findOne).toHaveBeenCalledWith(mockPedido.id);
    });

    it('should throw NotFoundException when pedido is not found', async () => {
      mockPedidosService.findOne.mockRejectedValue(
        new NotFoundException('Pedido com ID non-existent-id não encontrado'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update pedido status', async () => {
      const updateDto: UpdatePedidoStatusDto = {
        status: StatusPedido.EM_PREPARO,
      };

      const updatedPedido = { ...mockPedido, status: 'EM_PREPARO' };
      mockPedidosService.updateStatus.mockResolvedValue(updatedPedido);

      const result = await controller.updateStatus(mockPedido.id, updateDto);

      expect(result).toEqual(updatedPedido);
      expect(service.updateStatus).toHaveBeenCalledWith(
        mockPedido.id,
        updateDto,
      );
    });

    it('should throw NotFoundException when pedido is not found', async () => {
      const updateDto: UpdatePedidoStatusDto = {
        status: StatusPedido.EM_PREPARO,
      };

      mockPedidosService.updateStatus.mockRejectedValue(
        new NotFoundException('Pedido com ID non-existent-id não encontrado'),
      );

      await expect(
        controller.updateStatus('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
