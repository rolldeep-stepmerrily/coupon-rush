import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CouponsService } from './coupons.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators';

@ApiTags('coupons')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('iusse')
  @ApiOperation({ summary: '쿠폰 발급' })
  async issue(@User('id') userId: number) {
    return this.couponsService.issue(userId);
  }
}
