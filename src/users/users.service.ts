import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { UsersRepository } from './users.repository';
import { IUser } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUsers() {
    const users = [];

    for (let i = 0; i < 5500; i++) {
      const user: IUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
      };

      users.push(user);
    }

    for (let i = 0; i < users.length; i += 500) {
      const batch: IUser[] = users.slice(i, i + 500);

      await this.usersRepository.createUsers(batch);
    }
  }

  async deleteUsers() {
    return await this.usersRepository.deleteUsers();
  }
}
