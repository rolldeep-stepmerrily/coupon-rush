import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';

@Module({
  imports: [PrismaModule],
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
