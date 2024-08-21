import { Process, Processor } from '@nestjs/bull';

import { CouponsService } from './coupons.service';
import { Job } from 'bull';
import { InternalServerErrorException } from '@nestjs/common';

@Processor('coupons')
export class CouponsProcessor {
  constructor(private readonly couponsService: CouponsService) {}

  @Process('issue')
  async handleIssuance(job: Job<{ userId: number }>) {
    try {
      return await this.couponsService.processIssuance(job.data.userId);
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
