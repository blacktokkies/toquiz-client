import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { setSwagger } from 'libs/utils/swagger-setting';
import { winstonLogger } from 'libs/utils/wisnton-logger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    logger: winstonLogger,
  });
  setSwagger(app, 'api-swagger');
  const config = app.get<ConfigService>(ConfigService);

  await app.listen(config.get('API_PORT') || 3000);
}
bootstrap();
