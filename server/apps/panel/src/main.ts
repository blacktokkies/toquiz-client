import { NestFactory } from '@nestjs/core';
import { PanelModule } from './panel.module';
import { setSwagger } from 'libs/swagger-setting';

async function bootstrap() {
  const app = await NestFactory.create(PanelModule);
  setSwagger(app);
  await app.listen(3000);
}
bootstrap();
