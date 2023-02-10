import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { setSwagger } from 'libs/swagger-setting';
import { winstonLogger } from 'libs/wisnton-logger/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    logger: winstonLogger,
  });
  setSwagger(app, 'api-swagger');

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
