import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { PrismaModule } from './prisma/prisma.module';
import { HttpLoggerMiddleware } from './common/middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVER_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
      }),
      validationOptions: { abortEarly: true },
    }),
    PrismaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
