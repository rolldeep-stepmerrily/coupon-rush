import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const { NODE_ENV, PORT } = process.env;

const isProduction = NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProduction,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  if (isProduction) {
    app.use(helmet());
  }

  const config = new DocumentBuilder()
    .setTitle('NestJS Coupon Rush API')
    .setDescription('선착순 500명 쿠폰 발급!!!')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      persistAuthorization: true,
      syntaxHighlight: { theme: 'arta' },
      tryItOutEnabled: true,
    },
  });

  await app.listen(PORT);
}
bootstrap();
