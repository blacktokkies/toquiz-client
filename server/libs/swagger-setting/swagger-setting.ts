import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

const setSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Toquiz API')
    .setDescription('The Toquiz API')
    .setVersion('1.0')
    .addTag('Toquiz')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  new Logger('SettingSwagger').log(`Swagger setting success`);
};

export { setSwagger };
