import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { IUser } from './users.interface';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUsers(users: IUser[]) {
    try {
      return await this.prismaService.user.createMany({ data: users, skipDuplicates: true });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteUsers() {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.user.deleteMany();

        await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
