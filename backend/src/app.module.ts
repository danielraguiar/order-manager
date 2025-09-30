import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PratosModule } from './pratos/pratos.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [PrismaModule, PratosModule, PedidosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
