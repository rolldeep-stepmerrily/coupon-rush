import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Redis } from 'ioredis';

import { CouponsRepository } from './coupons.repository';

@Injectable()
export class CouponsService {
  private readonly COUPON_LIMIT = 500;

  constructor(
    private readonly couponsRepository: CouponsRepository,
    @InjectQueue('coupons') private couponsQueue: Queue,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async issue(userId: number) {
    const count = await this.redis.incr('count');

    if (count > this.COUPON_LIMIT) {
      await this.redis.decr('count');

      throw new BadRequestException('마감되었습니다. 1');
    }

    await this.couponsQueue.add('issue', { userId }, { attempts: 3 });

    return { message: 'issuing' };
  }

  async processIssuance(userId: number) {
    const count = await this.redis.get('count');

    if (parseInt(count ?? '0') > this.COUPON_LIMIT) {
      throw new BadRequestException('마감되었습니다. 2');
    }

    const coupon = await this.couponsRepository.createCoupon(userId);

    if (!coupon) {
      await this.redis.decr('count');

      throw new BadRequestException('쿠폰 발급에 실패하였습니다.');
    }

    return coupon;
  }

  async resetCouponCount() {
    await this.redis.flushdb();

    await this.couponsRepository.deleteAllCoupons();

    await this.redis.set('count', 0);
  }
}
