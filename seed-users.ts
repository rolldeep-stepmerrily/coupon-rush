import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const users = [];

  for (let i = 0; i < 5000; i++) {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: Math.random() > 0.9 ? faker.date.recent() : null,
    };

    users.push(user);
  }

  for (let i = 0; i < users.length; i += 500) {
    const batch = users.slice(i, i + 500);

    await prisma.user.createMany({ data: batch, skipDuplicates: true });
  }
};

main().finally(async () => {
  prisma.$disconnect();
});
