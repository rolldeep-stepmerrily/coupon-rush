import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs/promises';
import path from 'path';

import { CouponsService } from './coupons.service';
import { User } from 'src/common/decorators';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('jwt'))
  @Post('iusse')
  @ApiOperation({ summary: '쿠폰 발급' })
  async issue(@User('id') userId: number) {
    return this.couponsService.issue(userId);
  }

  @Post('test')
  @ApiOperation({ summary: '테스트' })
  async test() {
    const randomUserId = Math.floor(Math.random() * 5000) + 1;

    const filePath = path.join(process.cwd(), 'history');
    await fs.appendFile(filePath, `${randomUserId}\n`);

    return this.couponsService.issue(randomUserId);
  }

  @Post('reset')
  @ApiOperation({ summary: '쿠폰 카운트 초기화' })
  async reset() {
    return this.couponsService.resetCouponCount();
  }
}
