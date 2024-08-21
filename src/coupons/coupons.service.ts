import {
  BadRequestException,
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Redis } from 'ioredis';
import path from 'path';

import { CouponsRepository } from './coupons.repository';

@Injectable()
export class CouponsService {
  private readonly filePath: string;
  private readonly COUPON_LIMIT = 500;

  constructor(
    private readonly couponsRepository: CouponsRepository,
    @InjectQueue('coupons') private couponsQueue: Queue,
    @Inject('REDIS') private readonly redis: Redis,
  ) {
    this.filePath = path.join(process.cwd(), '.userIds');
  }

  async issue(userId: number) {
    const jobs = await this.couponsQueue.getJobs(['waiting', 'active', 'delayed']);
    const isExist = jobs.some((job) => {
      if (job?.data?.userId) {
        return job.data.userId === userId;
      }
    });

    if (isExist) {
      throw new ConflictException('발급 요청 중입니다.');
    }

    const count = await this.redis.incr('count');

    if (count > this.COUPON_LIMIT) {
      await this.redis.decr('count');

      throw new GoneException('마감되었습니다.');
    }

    await this.couponsQueue.add('issue', { userId }, { attempts: 3 });

    return { message: 'issuing' };
  }

  async processIssuance(userId: number) {
    const count = await this.redis.get('count');

    if (!count) {
      throw new InternalServerErrorException();
    }

    if (parseInt(count) > this.COUPON_LIMIT) {
      throw new BadRequestException('마감되었습니다.');
    }

    return await this.couponsRepository.createCoupon(userId);
  }

  async resetCouponCount() {
    return await Promise.all([
      this.redis.flushdb(),
      this.couponsRepository.deleteAllCoupons(),
      this.redis.set('count', 0),
      this.couponsQueue.empty(),
    ]);
  }
}
