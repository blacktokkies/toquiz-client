import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { setSwagger } from 'libs/utils/swagger-setting';
import { winstonLogger } from 'libs/utils/wisnton-logger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    logger: winstonLogger, // winston Logger 사용
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // request validation
  app.use(cookieParser()); // Cookie 사용
  setSwagger(app, 'api-swagger'); // Swagger 사용

  const config = app.get<ConfigService>(ConfigService);
  const PORT = config.get('API_PORT');

  await app.listen(PORT | 3000);
}
bootstrap();
