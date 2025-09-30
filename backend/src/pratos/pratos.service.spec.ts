import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PratosService } from './pratos.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePratoDto } from './dto/create-prato.dto';
import { UpdatePratoDto } from './dto/update-prato.dto';

describe('PratosService', () => {
  let service: PratosService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    prato: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPrato = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nome: 'Pizza Margherita',
    descricao: 'Pizza com molho de tomate, mussarela e manjericão',
    preco: 35.90,
    categoria: 'Pizza',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PratosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PratosService>(PratosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new prato', async () => {
      const createPratoDto: CreatePratoDto = {
        nome: 'Pizza Margherita',
        descricao: 'Pizza com molho de tomate, mussarela e manjericão',
        preco: 35.90,
        categoria: 'Pizza',
      };

      mockPrismaService.prato.create.mockResolvedValue(mockPrato);

      const result = await service.create(createPratoDto);

      expect(result).toEqual(mockPrato);
      expect(mockPrismaService.prato.create).toHaveBeenCalledWith({
        data: createPratoDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of pratos', async () => {
      const mockPratos = [mockPrato];
      mockPrismaService.prato.findMany.mockResolvedValue(mockPratos);

      const result = await service.findAll();

      expect(result).toEqual(mockPratos);
      expect(mockPrismaService.prato.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a prato by id', async () => {
      mockPrismaService.prato.findUnique.mockResolvedValue(mockPrato);

      const result = await service.findOne(mockPrato.id);

      expect(result).toEqual(mockPrato);
      expect(mockPrismaService.prato.findUnique).toHaveBeenCalledWith({
        where: { id: mockPrato.id },
      });
    });

    it('should throw NotFoundException when prato is not found', async () => {
      mockPrismaService.prato.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Prato com ID non-existent-id não encontrado',
      );
    });
  });

  describe('update', () => {
    it('should update a prato', async () => {
      const updatePratoDto: UpdatePratoDto = {
        preco: 39.90,
      };

      const updatedPrato = { ...mockPrato, preco: 39.90 };

      mockPrismaService.prato.findUnique.mockResolvedValue(mockPrato);
      mockPrismaService.prato.update.mockResolvedValue(updatedPrato);

      const result = await service.update(mockPrato.id, updatePratoDto);

      expect(result).toEqual(updatedPrato);
      expect(mockPrismaService.prato.update).toHaveBeenCalledWith({
        where: { id: mockPrato.id },
        data: updatePratoDto,
      });
    });

    it('should throw NotFoundException when prato is not found', async () => {
      mockPrismaService.prato.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a prato', async () => {
      mockPrismaService.prato.findUnique.mockResolvedValue(mockPrato);
      mockPrismaService.prato.delete.mockResolvedValue(mockPrato);

      const result = await service.remove(mockPrato.id);

      expect(result).toEqual(mockPrato);
      expect(mockPrismaService.prato.delete).toHaveBeenCalledWith({
        where: { id: mockPrato.id },
      });
    });

    it('should throw NotFoundException when prato is not found', async () => {
      mockPrismaService.prato.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
