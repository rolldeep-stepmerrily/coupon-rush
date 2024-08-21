import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InternalServerErrorException } from '@nestjs/common';

import { CouponsService } from './coupons.service';

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
