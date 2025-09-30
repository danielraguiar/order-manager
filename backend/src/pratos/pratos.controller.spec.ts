import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PratosController } from './pratos.controller';
import { PratosService } from './pratos.service';
import { CreatePratoDto } from './dto/create-prato.dto';
import { UpdatePratoDto } from './dto/update-prato.dto';

describe('PratosController', () => {
  let controller: PratosController;
  let service: PratosService;

  const mockPrato = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'Pizza Margherita',
    descricao: 'Pizza com molho de tomate, mussarela e manjericão',
    preco: 35.90,
    categoria: 'Pizza',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPratosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PratosController],
      providers: [
        {
          provide: PratosService,
          useValue: mockPratosService,
        },
      ],
    }).compile();

    controller = module.get<PratosController>(PratosController);
    service = module.get<PratosService>(PratosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new prato', async () => {
      const createPratoDto: CreatePratoDto = {
        nome: 'Pizza Margherita',
        descricao: 'Pizza com molho de tomate, mussarela e manjericão',
        preco: 35.90,
        categoria: 'Pizza',
      };

      mockPratosService.create.mockResolvedValue(mockPrato);

      const result = await controller.create(createPratoDto);

      expect(result).toEqual(mockPrato);
      expect(service.create).toHaveBeenCalledWith(createPratoDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of pratos', async () => {
      const mockPratos = [mockPrato];
      mockPratosService.findAll.mockResolvedValue(mockPratos);

      const result = await controller.findAll();

      expect(result).toEqual(mockPratos);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a prato by id', async () => {
      mockPratosService.findOne.mockResolvedValue(mockPrato);

      const result = await controller.findOne(mockPrato.id);

      expect(result).toEqual(mockPrato);
      expect(service.findOne).toHaveBeenCalledWith(mockPrato.id);
    });

    it('should throw NotFoundException when prato is not found', async () => {
      mockPratosService.findOne.mockRejectedValue(
        new NotFoundException('Prato com ID non-existent-id não encontrado'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a prato', async () => {
      const updatePratoDto: UpdatePratoDto = {
        preco: 39.90,
      };

      const updatedPrato = { ...mockPrato, preco: 39.90 };
      mockPratosService.update.mockResolvedValue(updatedPrato);

      const result = await controller.update(mockPrato.id, updatePratoDto);

      expect(result).toEqual(updatedPrato);
      expect(service.update).toHaveBeenCalledWith(mockPrato.id, updatePratoDto);
    });

    it('should throw NotFoundException when prato is not found', async () => {
      mockPratosService.update.mockRejectedValue(
        new NotFoundException('Prato com ID non-existent-id não encontrado'),
      );

      await expect(
        controller.update('non-existent-id', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a prato', async () => {
      mockPratosService.remove.mockResolvedValue(mockPrato);

      const result = await controller.remove(mockPrato.id);

      expect(result).toEqual(mockPrato);
      expect(service.remove).toHaveBeenCalledWith(mockPrato.id);
    });

    it('should throw NotFoundException when prato is not found', async () => {
      mockPratosService.remove.mockRejectedValue(
        new NotFoundException('Prato com ID non-existent-id não encontrado'),
      );

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
