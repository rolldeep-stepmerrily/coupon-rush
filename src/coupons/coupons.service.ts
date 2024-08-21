import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { CouponsRepository } from './coupons.repository';

@Injectable()
export class CouponsService {
  constructor(
    private readonly couponsRepository: CouponsRepository,
    @InjectQueue('coupons') private couponsQueue: Queue,
  ) {}

  async issue(userId: number) {
    await this.couponsQueue.add('issue', { userId }, { attempts: 3 });

    return { message: 'issuing' };
  }

  async processIssuance(userId: number) {
    const coupon = await this.couponsRepository.createCoupon(userId);

    if (!coupon) {
      throw new BadRequestException('쿠폰 발급에 실패하였습니다.');
    }

    return coupon;
  }
}
