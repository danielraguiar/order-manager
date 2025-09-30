import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PratosModule } from './pratos/pratos.module';

@Module({
  imports: [PrismaModule, PratosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
