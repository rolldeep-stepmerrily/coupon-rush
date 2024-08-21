import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { CouponsRepository } from './coupons.repository';
import { CouponsProcessor } from './coupons.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'coupons',
      defaultJobOptions: { removeOnComplete: true, attempts: 3 },
      settings: { stalledInterval: 300000, maxStalledCount: 1 },
    }),
  ],
  controllers: [CouponsController],
  providers: [CouponsService, CouponsRepository, CouponsProcessor],
})
export class CouponsModule {}
