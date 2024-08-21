import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  imports: [PrismaModule, BullModule.registerQueue({ name: 'coupons' })],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
