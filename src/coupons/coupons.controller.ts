import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs/promises';
import path from 'path';

import { CouponsService } from './coupons.service';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiOperation({ summary: '쿠폰 발급' })
  @Post('issue')
  async issue() {
    const randomUserId = Math.floor(Math.random() * 5000) + 1;

    const filePath = path.join(process.cwd(), '.history');

    await fs.appendFile(filePath, `${randomUserId}\n`);

    return this.couponsService.issue(randomUserId);
  }

  @Post('reset')
  @ApiOperation({ summary: '쿠폰 카운트 초기화' })
  async reset() {
    return this.couponsService.resetCouponCount();
  }
}
