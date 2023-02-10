import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { setSwagger } from 'libs/swagger-setting';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  setSwagger(app, 'api');

  await app.listen(3000);
}
bootstrap();
