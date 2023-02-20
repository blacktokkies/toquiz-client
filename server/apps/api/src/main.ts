import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { setSwagger } from 'libs/utils/swagger-setting';
import { winstonLogger } from 'libs/utils/wisnton-logger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    logger: winstonLogger,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  setSwagger(app, 'api-swagger');

  const config = app.get<ConfigService>(ConfigService);
  const PORT = config.get('API_PORT');

  await app.listen(PORT | 3000);
}
bootstrap();
