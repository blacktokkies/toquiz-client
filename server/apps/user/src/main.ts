import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { setSwagger } from 'libs/swagger-setting';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  setSwagger(app);
  await app.listen(3000);
}
bootstrap();
