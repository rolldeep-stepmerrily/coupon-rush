import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CouponsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createCoupon(userId: number) {
    try {
      return await this.prismaService.coupon.create({ data: { userId }, select: { id: true } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
