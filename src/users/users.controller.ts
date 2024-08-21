import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('faker')
  async createUsers() {
    await this.usersService.createUsers();
  }

  @Post('reset')
  async deleteUsers() {
    await this.usersService.deleteUsers();
  }
}
