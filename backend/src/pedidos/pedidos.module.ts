import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { PratosModule } from '../pratos/pratos.module';

@Module({
  imports: [PratosModule],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
