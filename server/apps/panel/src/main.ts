import { NestFactory } from '@nestjs/core';
import { PanelModule } from './panel.module';

async function bootstrap() {
  const app = await NestFactory.create(PanelModule);
  await app.listen(3000);
}
bootstrap();
