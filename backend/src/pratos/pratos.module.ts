import { Module } from '@nestjs/common';
import { PratosController } from './pratos.controller';
import { PratosService } from './pratos.service';

@Module({
  controllers: [PratosController],
  providers: [PratosService],
  exports: [PratosService],
})
export class PratosModule {}
